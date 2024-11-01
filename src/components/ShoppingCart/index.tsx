import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Router from 'next/router';

interface Product {
    ProductName: string;
}
interface CartItem {
    CartID: number;
    Quantity: number;
    Price: number;
    Product: Product;
}
interface UserInfo {
    userId: string;
    name: string;
    phone: string;
    address: string;
}

const ShoppingCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() => {
        const product = async () => {
            const token = () => {
                const token = localStorage.getItem('token');
                if (!token) return null;
                try {
                    const decoded: any = jwtDecode(token);
                    return decoded.UserID;
                } catch (error) {
                    console.error('토큰 디코드 에러:', error);
                    return null;
                }
            };
            const userId = token();
            try {
                const response = await axios.post(
                    'http://localhost:8000/cart',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setCart(response.data.data);
            } catch (error) {
                console.error('장바구니 내역을 가져오는데 실패했습니다.');
            }
        };
    });

    // 수량 변경 함수
    const quantityChange = async (cartId: number, newQuantity: number) => {
        try {
            // 서버에 수량 변경 요청
            await axios.post(
                'http://localhost:8000/cart/quantity',
                {
                    cartId,
                    quantity: newQuantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            // 성공하면 로컬 상태 업데이트
            setCart((prevCart) =>
                prevCart.map((item) => (item.CartID === cartId ? { ...item, Quantity: newQuantity } : item))
            );
            setEditingId(null); // 수정 모드 종료
        } catch (error) {
            console.error('수량 변경에 실패했습니다.', error);
            alert('수량 변경에 실패했습니다.');
        }
    };
    // 모든 상품 선택/해제
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedItems(cart.map((item) => item.CartID));
        } else {
            setSelectedItems([]);
        }
    };

    // 개별 상품 선택/해제
    const handleSelectItem = (cartId: number) => {
        setSelectedItems((prev) => {
            if (prev.includes(cartId)) {
                return prev.filter((id) => id !== cartId);
            } else {
                return [...prev, cartId];
            }
        });
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
                'http://localhost:8000/cart/deletecart',
                {
                    cartId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.result) {
                // 성공적으로 삭제되면 로컬 상태도 업데이트
                setCart(cart.filter((item) => item.CartID !== cartId));
                alert('상품이 삭제되었습니다.');
            }
        } catch (error) {
            console.error('장바구니 상품 삭제 실패:', error);
            alert('상품 삭제에 실패했습니다.');
        }
    };
    const goToOrder = async () => {
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요');
            return;
        }

        try {
            const selectedProducts = cart.filter((item) => selectedItems.includes(item.CartID));
            const token = () => {
                const token = localStorage.getItem('token');
                if (!token) return null;
                try {
                    const decoded: any = jwtDecode(token);
                    return {
                        userId: decoded.UserID,
                        name: decoded.UserName,
                        phone: decoded.UserPhone,
                        address: decoded.UserAddress,
                    };
                } catch (error) {
                    console.error('토큰 디코드 에러:', error);
                    return null;
                }
            };
            const userInfo = token();
            if (userInfo) {
                const { userId, name, phone, address } = userInfo;
                
            }
            const response = await axios.post(
                'http://localhost:8000/orders/prepare',
                {
                    userId: userInfo?.userId,
                    name: userInfo?.name,
                    phone:userInfo?.phone,
                    address:userInfo?.address,
                    cartItems: selectedProducts,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.result) {
                Router.push(`/order/${response.data.orderListId}`);
            }
        } catch (error) {
            console.error('주문 준비 중 오류 발생:', error);
            alert('주문 처리 중 오류가 발생했습니다.');
        }
    };
    return (
        <>
            <div>장바구니</div>
            <div>
                <input type="checkbox" checked={selectedItems.length === cart.length} onChange={handleSelectAll} /> 전체
                선택
            </div>
            <div>
                {cart && cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.CartID}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.CartID)}
                                onChange={() => handleSelectItem(item.CartID)}
                            />
                            <div>{item.Product.ProductName}</div>
                            <div>{item.Price.toLocaleString()}원</div>
                            <div>
                                {editingId === item.CartID ? (
                                    <select
                                        value={item.Quantity}
                                        onChange={(e) => quantityChange(item.CartID, Number(e.target.value))}
                                        onBlur={() => setEditingId(null)}
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
                            <div onClick={() => deleteItem(item.CartID)}>삭제</div>
                        </div>
                    ))
                ) : (
                    <div>장바구니에 담긴 물건이 없습니다.</div>
                )}
            </div>
            {cart.length > 0 && (
                <div>
                    <div>총 금액</div>
                    <div>상품 금액</div>
                    <div>{totalPrice.toLocaleString()}원</div>
                    <div>배송비</div>
                    <div>{fee().toLocaleString()}원</div>
                    <div>결제예정금액</div>
                    <div>{(totalPrice + fee()).toLocaleString()}원</div>
                    <div onClick={goToOrder}>주문하기</div>
                </div>
            )}
        </>
    );
};

export default ShoppingCart;
