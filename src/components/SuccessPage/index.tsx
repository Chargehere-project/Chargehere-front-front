import { useEffect } from "react";
import { useRouter } from "next/router";

export function SuccessPage() {
  const router = useRouter();
  const { orderId, amount, paymentKey } = router.query;

  useEffect(() => {
    if (!router.isReady) return;  // 라우터가 준비될 때까지 대기

    const requestData = {
      orderId,
      amount,
      paymentKey,
    };

    async function confirm() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const json = await response.json();

        if (!response.ok) {
          // 결제 실패 시
          router.push(`/fail?message=${json.message}&code=${json.code}`);
          return;
        }

        // 결제 성공 시
        router.push('/order-complete');
      } catch (error) {
        // 에러만 콘솔에 출력하고 라우터 이동은 하지 않음
        console.error('결제 확인 중 오류:', error);
      }
    }

    // 필수 파라미터가 모두 있을 때만 confirm 실행
    if (orderId && amount && paymentKey) {
      confirm();
    }
  }, [router.isReady, orderId, amount, paymentKey]);

  // 로딩 중이거나 파라미터가 없는 경우
  if (!router.isReady || !orderId || !amount || !paymentKey) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${paymentKey}`}</p>
      </div>
    </div>
  );
}

export default SuccessPage;