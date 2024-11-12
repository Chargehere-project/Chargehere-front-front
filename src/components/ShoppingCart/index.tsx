import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import Router from 'next/router';
import style from './shoppingcart.module.css';

interface Product {
    ProductID: number;
    ProductName: string;
    ProductImage: string;
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

    const quantityChange = async (cartId: number, newQuantity: number) => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/cart/quantity`,
                { cartId, quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setCart((prevCart) =>
                prevCart.map((item) => (item.CartID === cartId ? { ...item, Quantity: newQuantity } : item))
            );
            setEditingId(null);
        } catch (error) {
            console.error('수량 변경에 실패했습니다.', error);
            alert('수량 변경에 실패했습니다.');
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(cart.map((item) => item.CartID));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (cartId: number) => {
        setSelectedItems((prev) =>
            prev.includes(cartId) ? prev.filter((id) => id !== cartId) : [...prev, cartId]
        );
    };

    const totalPrice = cart.reduce((sum, item) => {
        if (selectedItems.includes(item.CartID)) {
            return sum + item.Price * item.Quantity;
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
            const sessionResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/check-session`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (!sessionResponse.data.result) {
                alert('세션 정보가 없습니다.');
                return;
            }
            // 선택된 상품들의 총 금액 계산
            const totalAmount = selectedProducts.reduce((sum, item) =>
                sum + (item.Price * item.Quantity), 0) + fee();
            // 주문 데이터 구성
            const orderData = {
                UserID: decoded.UserID,
                CustomerName: decoded.UserName,
                CustomerPhoneNumber: sessionResponse.data.userDetails.phoneNumber,
                CustomerAddress: sessionResponse.data.userDetails.address,
                TotalAmount: totalAmount,
                OrderStatus: 'Pending',
                orderItems: selectedProducts.map(item => ({
                    ProductID: item.Product.ProductID,
                    Quantity: item.Quantity,
                    Price: item.Price,
                    // Subtotal은 서버에서 계산됨
                }))
            };
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data.result) {
                Router.push(`/order/${response.data.orderListId}`);
            }
        } catch (error) {
            console.error('주문 생성 중 오류 발생:', error);
            alert('주문 처리 중 오류가 발생했습니다.');
        }
     };

    return (
        
        <div className={style.cartContainer}>
            <div className={style.cartMain}>
                <h1 className={style.cartTitle}>CART</h1>
                <div className={style.selectAllContainer}>
                    <label className={style.selectAllLabel}>
                        <input
                            type="checkbox"
                            className={style.selectAllCheckbox}
                            checked={selectedItems.length === cart.length}
                            onChange={handleSelectAll}
                        /> 전체 선택
                    </label>
                    {cart.length > 0 && (
                        <button 
                            onClick={deleteAllItems}
                            className={style.deleteAllButton}
                        >
                            선택 삭제
                        </button>
                    )}
                </div>
                <div className={style.cartItems}>
                    {cart.map((item) => (
                        <div key={item.CartID} className={style.cartItem}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.CartID)}
                                onChange={() => handleSelectItem(item.CartID)}
                                className={style.itemCheckbox}
                            />
                            <div className={style.itemImageContainer}>
                                <img
                                    src={item.Product.ProductImage}
                                    alt={item.Product.ProductName}
                                    className={style.itemImage}
                                />
                            </div>
                            <div className={style.itemDetails}>
                                <div className={style.itemName}>{item.Product.ProductName}</div>
                                <div className={style.itemPrice}>{item.Price.toLocaleString()}원</div>
                                <div className={style.itemQuantity}>
                                    {editingId === item.CartID ? (
                                        <select
                                            value={item.Quantity}
                                            onChange={(e) => quantityChange(item.CartID, Number(e.target.value))}
                                            onBlur={() => setEditingId(null)}
                                            className={style.quantitySelector}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span onClick={() => setEditingId(item.CartID)}>{item.Quantity}개</span>
                                    )}
                                </div>
                            </div>
                            <div
                                className={style.deleteButton}
                                onClick={() => deleteItem(item.CartID)}
                            >
                                삭제
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={style.summaryContainer}>
                <h2 className={style.summaryTitle}>주문 내역</h2>
                <div className={style.summaryRow}>
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className={style.summaryRow}>
                    <span>배송비</span>
                    <span>{fee().toLocaleString()}원</span>
                </div>
                <div className={`${style.summaryRow} ${style.summaryTotal}`}>
                    <span>총 결제 금액</span>
                    <span>{(totalPrice + fee()).toLocaleString()}원</span>
                </div>
                <button onClick={goToOrder} className={style.orderButton}>
                    주문하기
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
