import React from 'react';
const Footer = () => {
    return (
        <footer
            style={{
                backgroundColor: '#28323C',
                color: 'white',
                padding: '20px 0',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <div style={{ width: '100%', margin: '0 auto', lineHeight: '1.2', fontSize: '14px' }}>
                <p>상호: (주)Chargehere | 대표자명: 심지형</p>
                <p>사업자등록번호: 000-00-00000 | 통신판매업신고번호: 제0000-서울마포-0000호</p>
                <p>연락처: 00-000-0000 | 팩스: 000-0000-0000 | 이메일: chargehere@coding.com</p>
                <p>주소: 서울특별시 마포구 도화2길 53</p>
                <p>
                    <a
                        href="/terms"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            borderBottom: '1px solid #fff',
                            paddingBottom: '2px',
                            marginRight: '10px',
                        }}
                    >
                        이용약관
                    </a>
                    <a
                        href="/privacy"
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                            borderBottom: '1px solid #fff',
                            paddingBottom: '2px',
                        }}
                    >
                        개인정보처리방침
                    </a>
                </p>
                <p style={{ marginTop: '10px' }}>Copyright © Chargehere</p>
            </div>
        </footer>
    );
};
export default Footer;
