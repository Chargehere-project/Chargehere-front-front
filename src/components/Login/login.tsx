import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './login.module.css';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,  // 중요! 쿠키 전송을 위해 필요
  headers: {
    'Content-Type': 'application/json'
  }
});

const Login = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await api.post('/login', {
        id,
        password
      });

      console.log('로그인 응답:', response);
      console.log('응답 헤더:', response.headers);
      console.log('쿠키:', document.cookie); // 쿠키 확인용

      if (response.data.result) {
        localStorage.setItem('token', response.data.response.token);
        
        // 세션 확인 테스트
        try {
          const sessionCheck = await api.get('/check-session');
          console.log('세션 체크:', sessionCheck.data);
        } catch (sessionError) {
          console.error('세션 체크 실패:', sessionError);
        }

        alert(response.data.message);
        router.push('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', error.response?.data);
        alert(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="id">아이디:</label>
          <input
            className={styles.formInput}
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
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
            required
          />
        </div>
        <button className={styles.formButton} type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;