import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface OrderItem {
  productID: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  orderListId: string;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  paymentAmount: number;
}

interface Coupon {
  couponId: string;
  couponName: string;
  discountAmount: number;
  expirationDate: string;
}

const BillPage = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [points, setPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [userData, setUserData] = useState({ name: '', phone: '', address: '' });
    const [useSameInfo, setUseSameInfo] = useState(true);
    const [recipientData, setRecipientData] = useState({ name: '', phone: '', address: '' });
    
    const router = useRouter();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get('/api/order', {
                    params: { orderListId: '12345' },
                });
                setOrder(response.data);
            } catch (error) {
                console.error('주문 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/userInfo', { params: { userId: 'user123' } });
                setUserData(response.data);
                if (useSameInfo) {
                    setRecipientData(response.data); // 초기 설정에서 회원 정보와 동일하게 설정
                }
            } catch (error) {
                console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        const fetchPoints = async () => {
            try {
                const response = await axios.get('/api/points', { params: { userId: 'user123' } });
                setPoints(response.data.points);
            } catch (error) {
                console.error('포인트 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        const fetchCoupons = async () => {
            try {
                const response = await axios.get('/api/coupons', { params: { userId: 'user123' } });
                setAvailableCoupons(response.data);
            } catch (error) {
                console.error('쿠폰 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchOrderData();
        fetchUserData();
        fetchPoints();
        fetchCoupons();
    }, [useSameInfo]);

    const handleUsePoints = () => {
        if (pointsToUse > points) {
            alert('사용 가능한 포인트보다 더 많은 포인트를 사용할 수 없습니다.');
            return;
        }
        if (order) {
            const discountedAmount = Math.max(order.totalAmount - pointsToUse, 0);
            setOrder({
                ...order,
                paymentAmount: discountedAmount - (selectedCoupon ? selectedCoupon.discountAmount : 0),
            });
        }
    };

    const handleUseSameInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isSame = event.target.value === 'same';
        setUseSameInfo(isSame);
        if (isSame) {
            setRecipientData(userData);
        } else {
            setRecipientData({ name: '', phone: '', address: '' });
        }
    };

    const handleRecipientDataChange = (field: keyof typeof recipientData, value: string) => {
        setRecipientData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCouponSelection = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        if (order) {
            const discountedAmount = Math.max(order.totalAmount - pointsToUse, 0);
            setOrder({
                ...order,
                paymentAmount: discountedAmount - coupon.discountAmount,
            });
        }
    };

    const handlePayment = () => {
        router.push('/pay');
    };

    if (!order) {
        return <div>주문 정보를 불러오는 중입니다...</div>;
    }

    return (
        <div className="bill-page">
            <h2>주문서</h2>
            {order.items.map((item) => (
                <div key={item.productID} className="order-item">
                    <img src={item.image} alt={item.productName} style={{ width: '100px', height: '100px' }} />
                    <div>
                        <h4>{item.productName}</h4>
                        <p>수량: {item.quantity}</p>
                        <p>가격: ₩{item.price}</p>
                    </div>
                </div>
            ))}

            <div className="user-info">
                <h3>주문자 정보</h3>
                <p>이름: {userData.name}</p>
                <p>전화번호: {userData.phone}</p>
                <p>주소: {userData.address}</p>
            </div>

            <div className="recipient-info">
                <h3>배송지 정보</h3>
                <label>
                    <input
                        type="radio"
                        value="same"
                        checked={useSameInfo}
                        onChange={handleUseSameInfoChange}
                    />
                    회원정보와 동일
                </label>
                <label>
                    <input
                        type="radio"
                        value="different"
                        checked={!useSameInfo}
                        onChange={handleUseSameInfoChange}
                    />
                    직접 입력
                </label>

                <div>
                    <label>
                        이름:{" "}
                        <input
                            type="text"
                            value={recipientData.name}
                            onChange={(e) => handleRecipientDataChange("name", e.target.value)}
                            disabled={useSameInfo}
                        />
                    </label>
                    <label>
                        전화번호:{" "}
                        <input
                            type="text"
                            value={recipientData.phone}
                            onChange={(e) => handleRecipientDataChange("phone", e.target.value)}
                            disabled={useSameInfo}
                        />
                    </label>
                    <label>
                        주소:{" "}
                        <input
                            type="text"
                            value={recipientData.address}
                            onChange={(e) => handleRecipientDataChange("address", e.target.value)}
                            disabled={useSameInfo}
                        />
                    </label>
                </div>
            </div>

            <div className="order-summary">
                <p>총 주문 금액: ₩{order.totalAmount}</p>
                <p>할인 금액: ₩{order.discount}</p>
                <p>총 결제 금액: ₩{order.paymentAmount}</p>
            </div>

            <div className="points-section">
                <p>사용 가능한 포인트: {points}</p>
                <input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => setPointsToUse(Number(e.target.value))}
                    placeholder="사용할 포인트 입력"
                />
                <button onClick={handleUsePoints}>포인트 사용</button>
            </div>

            <div className="coupon-section">
                <h3>쿠폰 선택</h3>
                <select onChange={(e) => handleCouponSelection(availableCoupons[e.target.selectedIndex])}>
                    <option value="">쿠폰 선택</option>
                    {availableCoupons.map((coupon) => (
                        <option key={coupon.couponId} value={coupon.couponId}>
                            {coupon.couponName} - ₩{coupon.discountAmount} 할인 (유효기간: {coupon.expirationDate})
                        </option>
                    ))}
                </select>

                {selectedCoupon && <p>선택한 쿠폰: {selectedCoupon.couponName}</p>}
            </div>

            <button onClick={handlePayment} style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
                결제하기
            </button>
        </div>
    );
};

export default BillPage;