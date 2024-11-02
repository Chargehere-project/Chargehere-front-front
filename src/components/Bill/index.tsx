import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
    const [points, setPoints] = useState(0); // 사용 가능한 포인트
    const [pointsToUse, setPointsToUse] = useState(0); // 사용할 포인트
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]); // 사용 가능한 쿠폰
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null); // 선택한 쿠폰
    const router = useRouter();
    const { id } = router.query;


    useEffect(() => {
        // 주문 데이터를 가져오는 함수
        const fetchOrderData = async () => {
            try {
                // router가 준비되었는지 확인
                if (!router.isReady) return;
                
                // id가 있는지 확인
                if (!id) return;
    
                const response = await axios.get(`http://localhost:8000/order/${id}`);
                console.log(response.data)
                setOrder(response.data.data);
            } catch (error) {
                console.error('주문 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        const fetchPoints = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('로그인이 필요합니다.');
                    return;
                }
        
                const decoded: any = jwtDecode(token);
                const userId = decoded.UserID;
        
                const response = await axios.post(
                    'http://localhost:8000/point',
                    { userId },  // userId를 객체 형태로 전송
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
        
                console.log('포인트 응답:', response.data);
                
                if (response.data.result && response.data.data) {
                    setPoints(response.data.data.Points || 0);
                } else {
                    setPoints(0);
                }
            } catch (error) {
                console.error('포인트 조회 중 오류 발생:', error);
                setPoints(0);
            }
        };
                const fetchCoupons = async () => {
                    try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            alert('로그인이 필요합니다.');
                            return;
                        }
                
                        const decoded: any = jwtDecode(token);
                        const userId = decoded.UserID;
                
                        const response = await axios.post(
                            'http://localhost:8000/usercoupon',
                            { userId },  // userId를 객체 형태로 전송
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                }
                            }
                        );
                
                        console.log('포인트 응답:', response.data);
                        
                        if (response.data.result && response.data.data) {
                            setAvailableCoupons(response.data.data);
                        } else {
                            setAvailableCoupons([]);
                        }
                    } catch (error) {
                        console.error('포인트 조회 중 오류 발생:', error);
                        setAvailableCoupons([]);
                    }
            };

    
        fetchOrderData();
        fetchPoints()
        fetchCoupons()
    }, [router.isReady, id]); 

    // 포인트 사용 부분
        const handleUsePoints = () => {
            if (pointsToUse > points) {
            alert('사용 가능한 포인트보다 더 많은 포인트를 사용할 수 없습니다.');
            return;
            }
            if (order) {
            const discountedAmount = Math.max(order.totalAmount - pointsToUse, 0); // 포인트 적용 후 결제 금액
            setOrder({
                ...order,
                paymentAmount: discountedAmount - (selectedCoupon ? selectedCoupon.discountAmount : 0), // 포인트와 쿠폰 적용 후 최종 결제 금액
            });
            }
        };

    // 쿠폰을 선택하는 부분
        const handleCouponSelection = (coupon: Coupon) => {
            setSelectedCoupon(coupon);
            if (order) {
            const discountedAmount = Math.max(order.totalAmount - pointsToUse, 0); // 포인트 적용 후 결제 금액
            setOrder({
                ...order,
                paymentAmount: discountedAmount - coupon.discountAmount, // 쿠폰 적용 후 최종 결제 금액
            });
            }
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

        <div className="order-summary">
            <p>총 주문 금액: ₩{order.totalAmount}</p>
            <p>할인 금액: ₩{order.discount}</p>
            <p>총 결제 금액: ₩{order.paymentAmount}</p>
        </div>

        {/* 포인트 사용 섹션 */}
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

        {/* 쿠폰 선택 섹션 */}
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

        <button style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>결제하기</button>
        </div>
    );
    };

export default BillPage;