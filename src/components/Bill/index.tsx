import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { loadTossPayments } from '@tosspayments/payment-sdk'

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
    const [userData, setUserData] = useState({ UserName: '', Phone: '', Address: '' });
    const [useSameInfo, setUseSameInfo] = useState(true);
    const [recipientData, setRecipientData] = useState({ name: '', phone: '', address: '' });

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (router.isReady && id) {
            fetchOrderData();
            fetchPoints();
            fetchCoupons();
        }
    }, [router.isReady, id]);

    // 주문 데이터 조회 - GET /order/:id
    const fetchOrderData = async () => {
        try {
            if (!id) return;
            const response = await axios.get(`http://localhost:8000/order/${id}`);
            console.log('주문 데이터:', response.data);
            
            if (response.data.result) {
                setOrder(response.data.data);

            }
        } catch (error) {
            console.error('주문 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 포인트 조회 - POST /point
    const fetchPoints = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const decoded: any = jwtDecode(token);
            const userId = decoded.UserID;


            const response = await axios.post('http://localhost:8000/point', 
                { userId }
            );
            
            console.log('포인트 데이터:', response.data);
            
            if (response.data.result) {
                const userData = response.data.data;
                setPoints(userData.Points || 0);
                setUserData({
                    UserName: userData.Name,
                    Phone: userData.PhoneNumber,
                    Address: userData.Address
                });

                if (useSameInfo) {
                    setRecipientData({
                        name: userData.Name,
                        phone: userData.PhoneNumber,
                        address: userData.Address
                    });
                }
            }

        } catch (error) {
            console.error('포인트 조회 중 오류 발생:', error);
        }
    };

    // 쿠폰 조회 - POST /usercoupon
    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const decoded: any = jwtDecode(token);
            const userId = decoded.UserID;

            const response = await axios.post('http://localhost:8000/usercoupon', 
                { userId }
            );
            
            console.log('쿠폰 데이터:', response.data);

            if (response.data.result && response.data.data) {
                setAvailableCoupons(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);

            }
        } catch (error) {
            console.error('쿠폰 조회 중 오류 발생:', error);
        }
    };
    
    // 포인트 사용 처리

    const handleUsePoints = () => {
        if (!order) return;

        if (pointsToUse > points) {
            alert('사용 가능한 포인트보다 많은 포인트를 사용할 수 없습니다.');
            return;
        }

        const newPaymentAmount = order.totalAmount - pointsToUse;
        setOrder({
            ...order,
            paymentAmount: newPaymentAmount,
            discount: pointsToUse + (selectedCoupon?.discountAmount || 0)
        });
    };


    // 쿠폰 선택 처리
    const handleCouponSelection = (coupon: Coupon) => {
        if (!order) return;

        setSelectedCoupon(coupon);
        const newPaymentAmount = order.totalAmount - pointsToUse - coupon.discountAmount;
        setOrder({
            ...order,
            paymentAmount: newPaymentAmount,
            discount: pointsToUse + coupon.discountAmount
        });
    };

    if (!order) {
        return <div>주문 정보를 불러오는 중입니다...</div>;
    }


    const handleUseSameInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isSame = event.target.value === 'same';
        setUseSameInfo(isSame);
        if (isSame) {

            // userData의 필드명이 대문자로 시작하므로 그에 맞게 설정
            setRecipientData({
                name: userData.UserName,
                phone: userData.Phone,
                address: userData.Address
            });
        } else {
            // 직접 입력 선택 시 빈 값으로 초기화
            setRecipientData({
                name: '',
                phone: '',
                address: ''
            });
        }
    };
    
    // 배송지 정보 직접 입력 핸들러도 추가
    const handleRecipientDataChange = (field: keyof typeof recipientData, value: string) => {
        setRecipientData(prev => ({
            ...prev,
            [field]: value
        }));
    };


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
                <p>이름: {userData.UserName}</p>
                <p>전화번호: {userData.Phone}</p>
                <p>주소: {userData.Address}</p>
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

            <button style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
                결제하기
            </button>
        </div>
    );
};

export default BillPage;