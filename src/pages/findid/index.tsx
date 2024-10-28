import React from 'react';
import FindId from '../../components/Find/FindId';
const Findid = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>아이디 찾기</h2>
            <FindId />
            <p>
        비밀번호를 잊으셨나요? <a href="/findpw">비밀번호 찾기</a>
      </p>
        </div>
    );
};
export default Findid;