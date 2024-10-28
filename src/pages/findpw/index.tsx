import React from 'react';
import FindPw from '../../components/Find/FindPw';
const Findpw = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>비밀번호 찾기</h2>
            <FindPw />
            <p>
        아이디를 잊으셨나요? <a href="/findid">아이디 찾기</a>
      </p>
        </div>
    );
};
export default Findpw;