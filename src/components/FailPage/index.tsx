// src/components/FailPage/index.tsx
import { useRouter } from 'next/router';

export function FailPage() {
  const router = useRouter();
  const { message, code } = router.query;  // URL 파라미터 가져오기

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        {message && <p>사유: {message}</p>}
        {code && <p>에러 코드: {code}</p>}
        <button
          onClick={() => router.push('/')}
          className="button"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default FailPage;