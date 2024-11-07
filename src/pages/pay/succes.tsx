// pages/pay/success.js
import { useEffect } from "react";
import { useRouter } from "next/router";

const SuccessPage = () => {
  const router = useRouter();
  
  // useSearchParams 대신 router.query 사용
  const { orderId, amount, paymentKey } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const requestData = {
      orderId,
      amount,
      paymentKey,
    };

    // ... 나머지 코드
  }, [router.isReady, orderId, amount, paymentKey]);

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>결제 성공</h1>
      <p>주문번호: {orderId}</p>
      <p>결제금액: {amount}</p>
    </div>
  );
};

export default SuccessPage;