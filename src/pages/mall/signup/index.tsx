import React from 'react';
import SignUp from '../../../components/SignUp';
const SignUpPage = () => {
  return (
    <div>
      <SignUp />
      <p>
        이미 회원이신가요? <a href="/login">로그인</a>
      </p>
    </div>
  );
};
export default SignUpPage;