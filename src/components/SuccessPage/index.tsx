import { useEffect } from "react";
import { useRouter } from "next/router";

export function SuccessPage() {
  const router = useRouter();
  const { orderId, amount, paymentKey } = router.query;
 
  useEffect(() => {
    if (!router.isReady) return;
 
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
          router.push(`/fail?message=${json.message}&code=${json.code}`);
          return;
        }
 
      } catch (error) {
        console.error('결제 확인 중 오류:', error);
      }
    }
 
    if (orderId && amount && paymentKey) {
      confirm();
    }
  }, [router.isReady, orderId, amount, paymentKey]);
 
  if (!router.isReady || !orderId || !amount || !paymentKey) {
    return <div>로딩 중...</div>;
  }
 
  const handleGoShopping = () => {
    router.push('/mall'); // 쇼핑몰 페이지로 이동
  };
 
  return (
    <div className="result wrapper" style={{ 
      textAlign: 'center',
      padding: '50px' 
    }}>
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${orderId}`}</p>
        <p>{`결제 금액: ${Number(amount).toLocaleString()}원`}</p>
        <button 
          onClick={handleGoShopping}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3182f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          쇼핑하러 가기
        </button>
      </div>
    </div>
  );
 }
 
 export default SuccessPage;