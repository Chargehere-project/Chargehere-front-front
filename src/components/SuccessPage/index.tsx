import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 중앙에서 위쪽으로 이동 */
  height: 100vh;
  padding-top: 10%; /* 상단 여백 추가 */
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    padding-top: 15%;
  }

  @media (max-width: 480px) {
    padding-top: 20%;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #28a745;
  margin-bottom: 20px;
  font-weight: bold;

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Text = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 10px;

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #888;

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  /* 반응형 스타일 */
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
`;

const SuccessPage = () => {
  const router = useRouter();

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

  const goToMall = () => {
    router.push("/mall"); // 쇼핑하러가기 버튼 클릭 시 이동
  };

  if (!router.isReady) {
    return (
      <Container>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>결제 성공</Title>
      <Text>주문번호: {orderId}</Text>
      <Text>결제금액: {amount}원</Text>
      <Button onClick={goToMall}>쇼핑하러가기</Button>
    </Container>
  );
};

export default SuccessPage;