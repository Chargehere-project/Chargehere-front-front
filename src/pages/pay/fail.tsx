import { useRouter } from "next/router";

const FailPage = () => {
  const router = useRouter();
  
  // useSearchParams 대신 router.query 사용
  const { message, code } = router.query;

  if (!router.isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>결제 실패</h1>
      {message && <p>사유: {message}</p>}
      {code && <p>에러 코드: {code}</p>}
      <button onClick={() => router.push('/')}>홈으로 돌아가기</button>
    </div>
  );
};

export default FailPage;