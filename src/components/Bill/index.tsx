import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import style from './bill.module.css';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

interface OrderItem {
    productID: number;
    productName: string;
    quantity: number;
    price: number | string;
    image: string;
}

interface OrderData {
    orderListId: number;
    customerName: string;
    customerPhoneNumber: string;
    customerAddress: string;
    items: OrderItem[];
    totalAmount: number | string;
    paymentAmount: number | string;
    discount: number;
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
    const [amount, setAmount] = useState({
        currency: 'KRW',
        value: order?.paymentAmount || 1000,
    });
    const [ready, setReady] = useState<boolean>(false);
    const [widgets, setWidgets] = useState<any>(null);

    const router = useRouter();
    const { id } = router.query;
    const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
    const customerKey = 'h-BboQRT_1DOGkVEGD5-G';

    useEffect(() => {
        async function fetchPaymentWidgets() {
            try {
                const tossInstance = await loadTossPayments(clientKey);
                const widgetsInstance = tossInstance.widgets({
                    customerKey: customerKey,
                });

                setWidgets(widgetsInstance); // widgets 설정
                console.log('토스페이먼츠 인스턴스:', widgetsInstance);
            } catch (error) {
                console.error('토스페이먼츠 초기화 중 오류:', error);
            }
        }

        fetchPaymentWidgets();
    }, [clientKey, customerKey]);

    useEffect(() => {
        
        async function renderPaymentWidgets() {
            if (!widgets || !order) {
                console.log('widgets or order not ready', { widgets, order });
                return;
            }

            try {
                // paymentAmount를 정확히 객체 형태로 전달해 SDK 요구사항에 맞춤
                await widgets.setAmount({
                    currency: 'KRW',
                    value: Math.round(order.paymentAmount), // 소수 제거된 정수 값
                });
                console.log('결제 금액:', Math.round(order.paymentAmount));

                await Promise.all([
                    widgets.renderPaymentMethods({
                        selector: '#payment-method',
                        variantKey: 'DEFAULT',
                    }),
                    widgets.renderAgreement({
                        selector: '#agreement',
                        variantKey: 'AGREEMENT',
                    }),
                ]);

                setReady(true);
            } catch (error) {
                console.error('결제 위젯 렌더링 중 오류:', error);
            }
        }

        renderPaymentWidgets();
    }, [widgets, order]);
    // useEffect(() => {
    //   if (widgets == null || order == null) {
    //     return;
    //   }

    //   // order.paymentAmount가 준비된 이후에 설정
    //   widgets.setAmount(order.paymentAmount);
    // }, [widgets, order]);

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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`);
            console.log('주문 데이터:', response.data);
    
            if (response.data.result) {
                const fetchedOrder = {
                    ...response.data.data,
                    customerName: response.data.data.customerName,
                    customerPhoneNumber: response.data.data.customerPhoneNumber,
                    customerAddress: response.data.data.customerAddress,
                    items: response.data.data.items.map((item: OrderItem) => ({
                        ...item,
                        price: parseFloat(item.price as string),
                    })),
                    totalAmount: parseFloat(response.data.data.totalAmount),
                    paymentAmount: parseFloat(response.data.data.paymentAmount),
                };
                setOrder(fetchedOrder);
                console.log('변환된 주문 데이터:', fetchedOrder);
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

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/point`, { userId });
            console.log('포인트 데이터:', response.data);

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

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/usercoupon`, { userId });
            console.log('쿠폰 데이터:', response.data);

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
  
          // 1. 먼저 결제 정보를 서버에 저장
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
                  address: recipientData.address
              },
              paymentMethod: 'Card',
          };
  
          const transactionResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, paymentData);
          
          if (!transactionResponse.data.success) {
              throw new Error('거래 정보 생성 실패');
          }
  
  
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
        setRecipientData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (!order) {
        return <div>주문 정보를 불러오는 중입니다...</div>;
    }

    return (
        <>
            <div className={style.billPage}>
                <h2 className={style.headerTitle}>주문서</h2>

                {/* 주문 아이템 목록 */}
                {order.items.map((item) => (
                    <div key={item.productID} className={style.orderItem}>
                        <img src={item.image} alt={item.productName} className={style.itemImage} />
                        <div>
                            <h4>{item.productName}</h4>
                            <p>수량: {item.quantity}</p>
                            <p>가격: ₩{item.price}</p>
                        </div>
                    </div>
                ))}

                <div className={style.userInfo}>
                    <h3>주문자 정보</h3>
                    <p>이름: {userData.UserName}</p>
                    <p>전화번호: {userData.Phone}</p>
                    <p>주소: {userData.Address}</p>
                </div>

                <div className={style.recipientInfo}>
                    <h3>배송지 정보</h3>
                    <label className={style.label}>
                        <input
                            type="radio"
                            value="same"
                            checked={useSameInfo}
                            onChange={handleUseSameInfoChange}
                            className={style.radioButton}
                        />
                        회원정보와 동일
                    </label>
                    <label className={style.label}>
                        <input
                            type="radio"
                            value="different"
                            checked={!useSameInfo}
                            onChange={handleUseSameInfoChange}
                            className={style.radioButton}
                        />
                        직접 입력
                    </label>

                    <div>
                        <label className={style.label}>
                            이름:{' '}
                            <input
                                type="text"
                                value={recipientData.name}
                                onChange={(e) => handleRecipientDataChange('name', e.target.value)}
                                disabled={useSameInfo}
                                className={style.inputText}
                            />
                        </label>
                        <label className={style.label}>
                            전화번호:{' '}
                            <input
                                type="text"
                                value={recipientData.phone}
                                onChange={(e) => handleRecipientDataChange('phone', e.target.value)}
                                disabled={useSameInfo}
                                className={style.inputText}
                            />
                        </label>
                        <label className={style.label}>
                            주소:{' '}
                            <input
                                type="text"
                                value={recipientData.address}
                                onChange={(e) => handleRecipientDataChange('address', e.target.value)}
                                disabled={useSameInfo}
                                className={style.inputText}
                            />
                        </label>
                    </div>
                </div>

                <div className={style.orderSummary}>
                    <p>총 주문 금액: ₩{order.totalAmount}</p>
                    <p>할인 금액: ₩{order.discount}</p>
                    <p>총 결제 금액: ₩{order.paymentAmount}</p>
                </div>

                <div className={style.pointsSection}>
                    <p>사용 가능한 포인트: {points}</p>
                    <input
                        type="number"
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(Number(e.target.value))}
                        placeholder="사용할 포인트 입력"
                        className={style.inputNumber}
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

            <div className="wrapper" style={{ margin: '20px', padding: '20px', border: '1px solid #ddd' }}>
                <div className="box_section">
                    {/* 결제 수단 UI */}
                    <div id="payment-method" style={{ marginBottom: '30px', minHeight: '200px' }} />

                    {/* 이용약관 UI */}
                    <div id="agreement" style={{ marginBottom: '30px', minHeight: '100px' }} />

                    <button
            className="button"
            disabled={!ready}
            onClick={async () => {
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

                    // 1. 먼저 결제 정보를 서버에 저장
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
                            address: recipientData.address
                        },
                        paymentMethod: 'Card',
                        status: 'PENDING'  // 상태를 PENDING으로 변경
                    };

                    const transactionResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, paymentData);
                    
                    if (!transactionResponse.data.success) {
                        throw new Error('거래 정보 생성 실패');
                    }

                    const { transactionId } = transactionResponse.data;

                    // 2. 토스페이먼츠 결제 요청
                    const formattedOrderId = `ORDER-${String(order.orderListId)}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

                    await widgets.requestPayment({
                        orderId: formattedOrderId,
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
            }}
            style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                backgroundColor: ready ? '#3182f6' : '#ccc',
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
        </>
    );
};

export default BillPage;
