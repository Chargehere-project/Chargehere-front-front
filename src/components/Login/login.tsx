import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LoginStyled from './styled';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Login = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post('/api/login', { id, password });

      if (response.data.result) {
        try {
          localStorage.setItem('token', response.data.response.token);
        } catch (storageError) {
          console.error('토큰 저장 실패:', storageError);
          setErrorMessage('토큰 저장 중 문제가 발생했습니다.');
          return;
        }

        router.push('/mall');
      } else {
        setErrorMessage('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Login error:', axiosError);
      if (axiosError.response && axiosError.response.status === 404) {
        setErrorMessage('로그인 경로를 찾을 수 없습니다.');
      } else if (axiosError.response && axiosError.response.status === 401) {
        setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        setErrorMessage('서버와의 연결에 문제가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionCheck = await api.get('/api/check-session');
      } catch (sessionError) {
        console.error('세션 체크 실패:', sessionError);
      }
    };

    if (localStorage.getItem('token')) {
      checkSession();
    }
  }, []);

  const handleLogoClick = () => {
    router.push('/mall');
  };

  return (
    <LoginStyled>
      <div className="login-container">
        <div className="logo-container" onClick={handleLogoClick}>
          <Image src="/main.png" alt="Main Logo" width={300} height={100} />
        </div>
        {/* <h2 className="title">Login</h2> */}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="id" className="form-label">아이디</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="form-button">로그인</button>

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <p className="centered-text">
            <a href="/mall/findid" className="link">아이디/비밀번호 찾기</a>
          </p>
          <p className="centered-text">
            <a href="/mall/signup" className="link">회원가입</a>
          </p>
        </form>
      </div>
    </LoginStyled>
  );
};

export default Login;
