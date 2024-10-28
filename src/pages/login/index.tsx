import React from 'react';
import Login from '../../components/Login/login';
const LoginPage = () => {
  return (
    <div>
      <Login />
      <p>
        아이디/비밀번호를 잊으셨나요? <a href="/findid">아이디/비밀번호 찾기</a>
      </p>
      <p>
        아직 회원이 아니신가요? <a href="/signup">회원가입</a>
      </p>
    </div>
  );
};
export default LoginPage;