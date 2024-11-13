import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import style from './bill.module.css';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface OrderItem {
    productID: number;
    productName: string;
    quantity: number;
    price: number | string;
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
    const [recipientData, setRecipientData] = useState({
        name: userData.UserName,
        phone: userData.Phone,
        address: userData.Address,
    });
    const [ready, setReady] = useState<boolean>(false);
    const [widgets, setWidgets] = useState<any>(null);

    const router = useRouter();
    const { id } = router.query;
    const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
    const customerKey = 'h-BboQRT_1DOGkVEGD5-G';

    useEffect(() => {
        const fetchPaymentWidgets = async () => {
            try {
                const tossInstance = await loadTossPayments(clientKey);
                const widgetsInstance = tossInstance.widgets({ customerKey });
                setWidgets(widgetsInstance);
            } catch (error) {
                console.error('Toss Payments 초기화 중 오류:', error);
            }
        };
        fetchPaymentWidgets();
    }, [clientKey, customerKey]);

    useEffect(() => {
        const renderPaymentWidgets = async () => {
            if (!widgets || !order) return;

            try {
                await widgets.setAmount({
                    currency: 'KRW',
                    value: Math.round(order.paymentAmount),
                });

                await Promise.all([
                    widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
                    widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
                ]);

                setReady(true);
            } catch (error) {
                console.error('결제 위젯 렌더링 중 오류:', error);
            }
        };
        renderPaymentWidgets();
    }, [widgets, order]);

    useEffect(() => {
        if (router.isReady && id) {
            fetchOrderData();
            fetchPoints();
            fetchCoupons();
        }
    }, [router.isReady, id]);

    const fetchOrderData = async () => {
        try {
            if (!id) return;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/order/${id}`);
            if (response.data.result) {
                const fetchedOrder = {
                    ...response.data.data,
                    totalAmount: parseFloat(response.data.data.totalAmount) + 3000,
                    paymentAmount: parseFloat(response.data.data.totalAmount) + 3000,
                };
                setOrder(fetchedOrder);
            }
        } catch (error) {
            console.error('주문 데이터를 가져오는 중 오류 발생:', error);
        }
    };

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

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/point`, { userId });
            if (response.data.result) {
                const userData = response.data.data;
                setPoints(userData.Points || 0);
                setUserData({
                    UserName: userData.Name,
                    Phone: userData.PhoneNumber,
                    Address: userData.Address,
                });

                if (useSameInfo) {
                    setRecipientData({
                        name: userData.Name,
                        phone: userData.PhoneNumber,
                        address: userData.Address,
                    });
                }
            }
        } catch (error) {
            console.error('포인트 조회 중 오류 발생:', error);
        }
    };

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const decoded: any = jwtDecode(token);
            const userId = decoded.UserID;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/usercoupon`, { userId });
            if (response.data.result && response.data.data) {
                setAvailableCoupons(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
            }
        } catch (error) {
            console.error('쿠폰 조회 중 오류 발생:', error);
        }
    };

    const handlePayment = async () => {
        if (!widgets || !order || !ready) {
            alert('결제 정보를 불러오는 중입니다. 잠시만 기다려주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const decoded: any = jwtDecode(token);
            const userId = decoded.UserID;

            const paymentData = {
                orderListId: order.orderListId,
                userId,
                totalAmount: order.totalAmount,
                paymentAmount: order.paymentAmount,
                pointUsed: pointsToUse,
                couponUsed: selectedCoupon?.couponId,
                recipientInfo: {
                    name: recipientData.name,
                    phone: recipientData.phone,
                    address: recipientData.address,
                },
                paymentMethod: 'Card',
                status: 'PENDING',
            };

            const transactionResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/transaction`,
                paymentData
            );

            if (!transactionResponse.data.success) {
                throw new Error('거래 정보 생성 실패');
            }

            const { transactionId } = transactionResponse.data;

            await widgets.requestPayment({
                orderId: `ORDER-${String(order.orderListId)}-${Date.now()}`,
                orderName: `주문 ${order.orderListId}`,
                successUrl: `${window.location.origin}/payment/success?transactionId=${transactionId}`,
                failUrl: `${window.location.origin}/payment/fail?transactionId=${transactionId}`,
                customerName: userData.UserName,
                customerMobilePhone: userData.Phone,
            });
        } catch (error) {
            console.error('결제 처리 중 오류 발생:', error);
            alert('결제 처리 중 오류가 발생했습니다.');
        }
    };

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
            discount: pointsToUse + (selectedCoupon?.discountAmount || 0),
        });
    };

    const handleCouponSelection = (coupon: Coupon) => {
        if (!order) return;

        setSelectedCoupon(coupon);
        const newPaymentAmount = order.totalAmount - pointsToUse - coupon.discountAmount;
        setOrder({
            ...order,
            paymentAmount: newPaymentAmount,
            discount: pointsToUse + coupon.discountAmount,
        });
    };

    const handleUseSameInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isSame = event.target.value === 'same';
        setUseSameInfo(isSame);
        if (isSame) {
            setRecipientData({
                name: userData.UserName,
                phone: userData.Phone,
                address: userData.Address,
            });
        } else {
            setRecipientData({ name: '', phone: '', address: '' });
        }
    };

    const handleRecipientDataChange = (field: keyof typeof recipientData, value: string) => {
        setRecipientData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className={style.billPage}>
            <h2 className={style.headerTitle}>주문서</h2>

            <div className={style.mainContent}>
                <div className={style.leftSection}>
                    <h3>배송지 정보</h3>
                    <label>
                        <input type="radio" value="same" checked={useSameInfo} onChange={handleUseSameInfoChange} /> 회원정보와 동일
                    </label>
                    <label>
                        <input type="radio" value="different" checked={!useSameInfo} onChange={handleUseSameInfoChange} /> 직접 입력
                    </label>
                    <input
                        type="text"
                        placeholder="이름"
                        value={recipientData.name}
                        disabled={useSameInfo}
                        onChange={(e) => handleRecipientDataChange('name', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="전화번호"
                        value={recipientData.phone}
                        disabled={useSameInfo}
                        onChange={(e) => handleRecipientDataChange('phone', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="주소"
                        value={recipientData.address}
                        disabled={useSameInfo}
                        onChange={(e) => handleRecipientDataChange('address', e.target.value)}
                    />
                    <div className={style.pointsSection}>
                <h3>포인트 사용</h3>
                <p>사용 가능한 포인트: {points}</p>
                <input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => setPointsToUse(Number(e.target.value))}
                    placeholder="사용할 포인트 입력"
                />
                <button onClick={handleUsePoints}>포인트 사용</button>
            </div>

            <div className={style.couponSection}>
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

                </div>

                <div className={style.rightSection}>
                    <h3>주문 내역</h3>
                    {order?.items.map((item) => (
                        <div key={item.productID} className={style.orderItem}>
                            <img src={item.image} alt={item.productName} className={style.itemImage} />
                            <div>{item.productName}</div>
                            <div>수량: {item.quantity}</div>
                            <div>가격: ₩{item.price}</div>
                        </div>
                    ))}
                    <div className={style.orderSummary}>
                        <p>총 주문 금액: ₩{order?.totalAmount}</p>
                        <p>할인 금액: ₩{order?.discount}</p>
                        <p>총 결제 금액: ₩{order?.paymentAmount}</p>
                    </div>
                </div>
            </div>


            <div className="wrapper" style={{ margin: '20px', padding: '20px', border: '1px solid #ddd' }}>
                <div id="payment-method" style={{ marginBottom: '30px', minHeight: '200px' }} />
                <div id="agreement" style={{ marginBottom: '30px', minHeight: '100px' }} />

                <button
                    className={style.buttonClass}
                    disabled={!ready}
                    onClick={handlePayment}
                    style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '16px',
                        backgroundColor: ready ? 'balck' : '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: ready ? 'pointer' : 'not-allowed',
                    }}
                >
                    결제하기
                </button>
            </div>
        </div>
    );
};

export default BillPage;
