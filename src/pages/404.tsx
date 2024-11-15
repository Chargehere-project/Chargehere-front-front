import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const HomeButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0051af;
  }
`;

const NotFound = () => {
  const router = useRouter();

  return (
    <NotFoundContainer>
      <Title>404 - 페이지를 찾을 수 없습니다</Title>
      <Message>요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</Message>
      <HomeButton onClick={() => router.push('/')}>
        홈으로 돌아가기
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;