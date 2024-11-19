import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Image from 'next/image';
import Router from 'next/router';
import CartStyled from './styled';

interface Product {
    ProductID: number;
    ProductName: string;
    ProductImage: string;
    Image: string;
    Price: number;
}

interface CartItem {
    CartID: number;
    Quantity: number;
    Price: number;
    Product: Product;
}

const ShoppingCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                Router.push('/mall/login');
                return;
            }

            const userId = (jwtDecode(token) as any).UserID;

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCart(response.data.data);
            } catch (error) {
                console.error('장바구니 내역을 가져오는데 실패했습니다.');
            }
        };

        fetchCart();
    }, []);


    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(cart.map((item) => item.CartID));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (cartId: number) => {
        setSelectedItems((prev) => (prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]));
    };

    const totalPrice = cart.reduce((sum, item) => {
        if (selectedItems.includes(item.CartID)) {
            return sum + item.Product.Price * item.Quantity;
        }
        return sum;
    }, 0);

    const fee = () => (totalPrice < 50000 ? 3000 : 0);

    const deleteItem = async (cartId: number) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/deletecart`,
                { cartId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.result) {
                setCart(cart.filter((item) => item.CartID !== cartId));
                window.dispatchEvent(new Event('cartUpdated'));
                alert('상품이 삭제되었습니다.');
            }
        } catch (error) {
            console.error('장바구니 상품 삭제 실패:', error);
            alert('상품 삭제에 실패했습니다.');
        }
    };

    const deleteAllItems = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                Router.push('/mall/login');
                return;
            }

            for (const cartId of selectedItems) {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/cart/deletecart`,
                    { cartId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // 선택된 항목 삭제 후 상태 업데이트
            setCart(cart.filter((item) => !selectedItems.includes(item.CartID)));
            window.dispatchEvent(new Event('cartUpdated'));
            setSelectedItems([]);
            alert('선택된 항목이 삭제되었습니다.');
        } catch (error) {
            console.error('선택된 항목 삭제 실패:', error);
            alert('선택된 항목 삭제에 실패했습니다.');
        }
    };

    const goToOrder = async () => {
        try {
            const selectedProducts = cart.filter((item) => selectedItems.includes(item.CartID));
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                Router.push('/mall/login');
                return;
            }
            const decoded: any = jwtDecode(token);
            // 세션 체크
            const sessionResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/check-session`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!sessionResponse.data.result) {
                alert('세션 정보가 없습니다.');
                return;
            }
            // 선택된 상품들의 총 금액 계산
            const totalAmount = selectedProducts.reduce((sum, item) => sum + item.Price * item.Quantity, 0) + fee();
            // 주문 데이터 구성
            const orderData = {
                UserID: decoded.UserID,
                CustomerName: decoded.UserName,
                CustomerPhoneNumber: sessionResponse.data.userDetails.phoneNumber,
                CustomerAddress: sessionResponse.data.userDetails.address,
                TotalAmount: totalAmount,
                OrderStatus: 'Pending',
                orderItems: selectedProducts.map((item) => ({
                    ProductID: item.Product.ProductID,
                    Quantity: item.Quantity,
                    Price: item.Price,
                    // Subtotal은 서버에서 계산됨
                })),
            };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.result) {
                Router.push(`/order/${response.data.orderListId}`);
            }
        } catch (error) {
            console.error('주문 생성 중 오류 발생:', error);
            alert('주문할 상품을 선택해주세요');
        }
    };

    return (
        <CartStyled>
            <div className="cartContainer">
                <div className="cartMain">
                    <h1 className="cartTitle">CART</h1>
                    {cart.length === 0 ? (
                        <div className="emptyCartMessage">장바구니에 상품이 없습니다</div>
                    ) : (
                        <>
                            <div className="selectAllContainer">
                                <label className="selectAllLabel">
                                    <input
                                        type="checkbox"
                                        className="selectAllCheckbox"
                                        checked={selectedItems.length === cart.length}
                                        onChange={handleSelectAll}
                                    />{' '}
                                    전체 선택
                                </label>
                                {cart.length > 0 && (
                                    <button onClick={deleteAllItems} className="deleteAllButton">
                                        선택 삭제
                                    </button>
                                )}
                            </div>
                            <div className="cartItems">
                                {cart.map((item) => (
                                    <div key={item.CartID} className="cartItem">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.CartID)}
                                            onChange={() => handleSelectItem(item.CartID)}
                                            className="itemCheckbox"
                                        />
                                        <div className="itemImageContainer">
                                            <img
                                                src={item.Product.Image}
                                                alt={item.Product.ProductName}
                                                className="itemImage"
                                            />
                                        </div>

                                        <div className="itemDetails">
                                            <div
                                                className="itemName"
                                                onClick={() => Router.push(`/mall/product/${item.Product.ProductID}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {item.Product.ProductName}
                                            </div>

                                            <div className="itemPrice">
                                                {item.Product.Price.toLocaleString()}
                                                <span>원</span>
                                            </div>
                                            <div className="itemQuantity">
                                                    <span onClick={() => setEditingId(item.CartID)}>
                                                        {item.Quantity}개
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="summaryContainer">
                        <h2 className="summaryTitle">주문 내역</h2>

                        <div className="summaryRow">
                            <span>상품 금액</span>
                            <span>{totalPrice.toLocaleString()}원</span>
                        </div>

                        <div className="summaryRow">
                            <span>배송비</span>
                            <span>{fee() === 0 ? '무료' : `${fee().toLocaleString()}원`}</span>
                        </div>

                        <div className="summaryTotal">
                            <span>총 결제 금액</span>
                            <span>{(totalPrice + fee()).toLocaleString()}원</span>
                        </div>

                        <button onClick={goToOrder} className="orderButton">
                            주문결제
                        </button>
                    </div>
                )}
            </div>
        </CartStyled>
    );
};

export default ShoppingCart;
