import React from 'react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={linkContainerStyle}>
                <a href="/laws/privacy" style={linkStyle}>PRIVACY POLICY</a>
                <a href="/laws/terms" style={linkStyle}>TERMS AND CONDITIONS</a>
                <a href="/notice" style={linkStyle}>NOTICE</a>
                <a href="/faqs" style={linkStyle}>FAQS</a>
                <FacebookOutlined style={iconStyle} />
                <InstagramOutlined style={iconStyle} />
            </div>
            <div style={infoContainerStyle}>
                <p>상호: (주)Chargehere | 대표자명: 심지형</p>
                <p>사업자등록번호: 000-00-00000 | 통신판매업신고번호: 제0000-서울마포-0000호</p>
                <p>연락처: 00-000-0000 | 팩스: 000-0000-0000 | 이메일: chargehere@coding.com</p>
                <p>주소: 서울특별시 마포구 도화2길 53</p>
            </div>
        </footer>
    );
};

// 스타일 정의
const footerStyle = {
    color: '#333',
    padding: '20px 0',
    width: '100%',
    borderTop: '1px solid #ddd',
    margin:'20px'
};

const linkContainerStyle = {
    display: 'start',
    justifyContent: 'left',
    alignItems: 'left',
    gap: '15px',
    marginBottom: '10px',
    fontSize: '14px',
    
};

const linkStyle = {
    color: 'black',
    textDecoration: 'none',
    padding: '20px',
};

const iconStyle = {
    fontSize: '18px',
    marginLeft: '10px',
    cursor: 'pointer',
};

const infoContainerStyle = {
    lineHeight: '0.8',
    fontSize: '12px',
    color: 'black',
    maxWidth: '1400px',
    justifyContent: 'left',
    padding: '20px',
    borderTop: '1px solid #ddd',
};

export default Footer;