import React from 'react';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.linkContainer}>
                <div className={styles.links}>
                    <a href="/laws/privacy" className={styles.link}>PRIVACY POLICY</a>
                    <a href="/laws/terms" className={styles.link}>TERMS AND CONDITIONS</a>
                    <a href="/notice" className={styles.link}>NOTICE</a>
                    <a href="/faqs" className={styles.link}>FAQS</a>
                </div>
                <div className={styles.socialIcons}>
                    <FacebookOutlined className={styles.icon} />
                    <InstagramOutlined className={styles.icon} />
                </div>
            </div>
            <div className={styles.infoContainer}>
                <p>상호: (주)Chargehere | 대표자명: 심지형</p>
                <p>사업자등록번호: 000-00-00000 | 통신판매업신고번호: 제0000-서울마포-0000호</p>
                <p>연락처: 00-000-0000 | 팩스: 000-0000-0000 | 이메일: chargehere@coding.com</p>
                <p>주소: 서울특별시 마포구 도화2길 53</p>
            </div>
        </footer>
    );
};

export default Footer;