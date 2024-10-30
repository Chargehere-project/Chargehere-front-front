import React, { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './login.module.css';


const Login = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/login', {
        id,
        password
      });

      if (response.data.result) {
        localStorage.setItem('token', response.data.response.token);
        alert(response.data.message);
        router.push('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
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
            className={styles.formInput}
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
            className={styles.formInput}
            required
          />
        </div>

        <button className={styles.formButton} type="submit">로그인</button>

      </form>
    </div>
  );
};

export default Login;