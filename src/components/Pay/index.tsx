import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import axios from "axios";
import { jwtDecode } from "jwt-decode";  // jwt-decode import 추가

const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = "YbX2HuSlsC9uVJW6NMRMj";

interface CustomPaymentInfo {
  orderId: string;
  orderName: string;
  customerName: string;
  amount: number;
  successUrl: string;
  failUrl: string;
}

export default function PaymentPage() {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [orderListId, setOrderListId] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [originalAmount, setOriginalAmount] = useState<number>(0);  // 추가
  const [customerName, setCustomerName] = useState<string>("");
  const [pointsToUse, setPointsToUse] = useState<number>(0);  // 추가
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const decoded: any = jwtDecode(token);  // 토큰 디코드

        // 최신 주문서 ID 및 사용자 정보 가져오기
        const orderResponse = await axios.get('/api/order/latest', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const orderData = orderResponse.data;
        setOrderListId(orderData.orderListId);
        setFinalAmount(orderData.paymentAmount);
        setOriginalAmount(orderData.totalAmount);  // 원래 금액 저장
        setCustomerName(orderData.customerName);  // 주문 데이터에서 바로 고객 이름 가져오기

      } catch (error) {
        console.error("주문서 또는 사용자 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();

    // Toss 결제 위젯 로드
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);
      paymentWidgetRef.current = paymentWidget;
    })();
  }, []);

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;
    if (!paymentWidget || orderListId === null) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        const decoded: any = jwtDecode(token);  // 토큰 디코드

        await paymentWidget.requestPayment({
            orderId: nanoid(),
            orderName: "결제하기",
            customerName,
            amount: finalAmount,
            successUrl: `${window.location.origin}/success`,
            failUrl: `${window.location.origin}/fail`,
        } as CustomPaymentInfo);

        // 결제 성공 시 트랜잭션 생성
        const response = await axios.post("/api/transaction", {
            orderListId,
            userId: decoded.UserID,  // 디코드된 토큰에서 UserID 사용
            totalAmount: originalAmount,
            paymentAmount: finalAmount,
            pointUsed: pointsToUse,
            paymentMethod: "Card",
            status: "Completed"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.earnedPoints) {
            alert(`${response.data.earnedPoints} 포인트가 적립되었습니다!`);
        }

    } catch (error) {
        console.error("결제 또는 트랜잭션 저장 중 오류 발생:", error);
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (orderListId === null) {
    return <div>주문서 ID를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div>
      <h1>결제</h1>
      <p>결제 금액: ₩{finalAmount.toLocaleString()}</p>
      {originalAmount > finalAmount && (
        <p>포인트 사용 금액: ₩{(originalAmount - finalAmount).toLocaleString()}</p>
      )}
      <button 
        onClick={handlePayment} 
        style={{ 
          padding: '10px', 
          backgroundColor: 'green', 
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer' 
        }}
      >
        결제하기
      </button>
    </div>
  );
}