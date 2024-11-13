import React from 'react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import FooterStyled from './styled';
import Image from 'next/image';
import Router from 'next/router';

const Footer = () => {
    const facebook = () => {
        window.open('https://www.facebook.com/profile.php?id=61568595901060', '_blank');
        // '_blank'는 새 창에서 열기를 지정
    }
    
    const insta = () => {
        window.open('https://www.instagram.com/chargehere_/', '_blank');
    }
    return (
        <FooterStyled>
            <footer className= 'footer'>
            <div className= 'linkContainer'>
                <div className= 'links'>
                    <a href="/laws/privacy" className= 'link'>
                        PRIVACY POLICY
                    </a>
                    <a href="/laws/terms" className= 'link'>
                        TERMS AND CONDITIONS
                    </a>
                    <a href="/notice" className= 'link'>
                        NOTICE
                    </a>
                    <a href="/faqs" className= 'link'>
                        FAQS
                    </a>
                </div>
                <div className= 'socialIcons'>
                  
                    <a href="https://www.facebook.com/profile.php?id=61568595901060" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/icons/facebook.png"
                            alt="Facebook"
                            width={25}
                            height={25}
                            className= 'icon'
                        />
                    </a>
                    <a href="https://www.instagram.com/chargehere_/" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/icons/instagram.png"
                            alt="Instagram"
                            width={27}
                            height={27}
                            className= 'icon'
                        />
                    </a>
                </div>
            </div>
            <div className= 'infoContainer'>
                <p>
                    <strong>(주)Chargehere</strong>
                </p>
                <p>대표자명: 심지형 | 서울특별시 마포구 도화2길 53</p>
                <p>통신판매업신고번호: 제0000-서울마포-0000호 | 등록번호: 000-00-00000 사업자 정보 확인</p>
                <p>고객센터 전화 문의: 00-000-0000 | FAX: 000-0000-0000 | 이메일: chargehere@coding.com</p>
                <p>호스팅서비스사업자: (주)Chargehere</p>
            </div>
        </footer>

        </FooterStyled>
        
    );
};

export default Footer;
