import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import axios from "axios";

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
  const [customerName, setCustomerName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // 최신 주문서 ID 및 사용자 정보 가져오기
        const orderResponse = await axios.get('/api/order/latest');
        const orderData = orderResponse.data;
        setOrderListId(orderData.orderListId);
        setFinalAmount(orderData.paymentAmount);

        // 정보 가져오기(사용자 관련)
        const userResponse = await axios.get(`/api/user/${orderData.userId}`);
        setCustomerName(userResponse.data.name);
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
      await paymentWidget.requestPayment({
        orderId: nanoid(),
        orderName: "결제하기",
        customerName,
        amount: finalAmount,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      } as CustomPaymentInfo);
    } catch (error) {
      console.error("결제 요청 중 오류 발생:", error);
    }

    // 결제 성공 시 Transactions 테이블에 저장
    try {
      await axios.post("/api/transaction", {
        orderListId,
        paymentAmount: finalAmount,
        paymentMethod: "Card",
        status: "Completed",
      });
    } catch (error) {
      console.error("결제 내역 저장 중 오류 발생:", error);
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
      <p>결제 금액: ₩{finalAmount}</p>
      <button onClick={handlePayment} style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
        결제하기
      </button>
    </div>
  );
}