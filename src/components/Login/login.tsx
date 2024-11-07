import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './login.module.css';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true, // 중요! 쿠키 전송을 위해 필요
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
      const response = await api.post('/api/login', {
        id,
        password,
      });

      if (response.data.result) {
        localStorage.setItem('token', response.data.response.token);

        // 세션 확인 테스트
        try {
          const sessionCheck = await api.get('/api/check-session');
          console.log('세션 체크:', sessionCheck.data);
        } catch (sessionError) {
          console.error('세션 체크 실패:', sessionError);
        }

        router.push('/mall');
      } else {
        setErrorMessage('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('서버와의 연결에 문제가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container} >

<div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="id">아이디:</label>
          <input
            className={styles.formInput}
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디를 입력하세요"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">비밀번호:</label>
          <input
            className={styles.formInput}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button className={styles.formButton} type="submit">로그인</button>

        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

        <p className={styles.centeredText}>
          아이디/비밀번호를 잊으셨나요? <a href="/mall/findid" className={styles.link}>아이디/비밀번호 찾기</a>
        </p>
        <p className={styles.centeredText}>
          아직 회원이 아니신가요? <a href="/mall/signup" className={styles.link}>회원가입</a>
        </p>
      </form>
    </div>

    
    
    </div>
   
  );
};

export default Login;
