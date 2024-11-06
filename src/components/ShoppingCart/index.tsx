import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Router from 'next/router';
import style from './shoppingcart.module.css';

interface Product {
    ProductName: string;
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
        fetchCart();
    }, []);

    const quantityChange = async (cartId: number, newQuantity: number) => {
        try {
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

    const goToOrder = async () => {
        if (selectedItems.length === 0) {
            alert('주문할 상품을 선택해주세요');
            return;
        }

        try {
            const selectedProducts = cart.filter((item) => selectedItems.includes(item.CartID));
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('로그인이 필요합니다.');
                Router.push('/login');
                return;
            }

            const decoded: any = jwtDecode(token);

            const sessionResponse = await axios.get('http://localhost:8000/check-session', {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (!sessionResponse.data.result) {
                alert('세션 정보가 없습니다.');
                return;
            }

            const { phoneNumber, address } = sessionResponse.data.userDetails;

            const orderData = {
                userId: decoded.UserID,
                name: decoded.UserName,
                phone: phoneNumber,
                address: address,
                cartItems: selectedProducts,
                totalAmount: totalPrice + fee(),
            };

            sessionStorage.setItem('orderData', JSON.stringify(orderData));
            Router.push('/bill');
        } catch (error) {
            console.error('주문 준비 중 오류 발생:', error);
            alert('주문 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={style.cartContainer}>
            <h1 className={style.cartTitle}>장바구니</h1>
            <div className={style.selectAllContainer}>
                <label className={style.selectAllLabel}>
                    <input
                        type="checkbox"
                        className={style.selectAllCheckbox}
                        checked={selectedItems.length === cart.length}
                        onChange={handleSelectAll}
                    /> 전체 선택
                </label>
            </div>
            <div className={style.cartItems}>
                {cart && cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.CartID} className={style.cartItem}>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.CartID)}
                                onChange={() => handleSelectItem(item.CartID)}
                                className={style.itemCheckbox}
                            />
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
                    ))
                ) : (
                    <div>장바구니에 담긴 물건이 없습니다.</div>
                )}
            </div>
            {cart.length > 0 && (
                <div className={style.summaryContainer}>
                    <div className={style.summaryRow}>
                        <span>상품 금액</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                    </div>
                    <div className={style.summaryRow}>
                        <span>배송비</span>
                        <span>{fee().toLocaleString()}원</span>
                    </div>
                    <div className={`${style.summaryRow} ${style.summaryTotal}`}>
                        <span>결제 예정 금액</span>
                        <span>{(totalPrice + fee()).toLocaleString()}원</span>
                    </div>
                    <button onClick={goToOrder} className={style.orderButton}>
                        주문하기
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
