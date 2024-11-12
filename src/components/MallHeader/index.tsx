import Image from 'next/image';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { UserOutlined, ShoppingOutlined, LoginOutlined, MenuOutlined  } from '@ant-design/icons';
import axios from 'axios';
import styles from './MallHeader.module.css';


const MallHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const token = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.UserID;
        } catch (error) {
            console.error('토큰 디코드 에러:', error);
            return null;
        }
    };

    const fetchCartCount = async () => {
        const user = token();
        if (user) {
            try {
                const response = await axios.get(`/api/cart/${user}/count`);
                setCartCount(response.data.count);
            } catch (error) {
                console.error('장바구니 개수 불러오기 에러:', error);
            }
        }
    };

    const cart = () => {
        const user = token();
        if (!user) {
            alert('로그인이 필요합니다.');
            Router.push('/mall/login');
        } else {
            Router.push(`/mall/cart/${user}`);
        }
    };

    const profile = () => {
        const user = token();
        if (!user) {
            alert('로그인이 필요합니다.');
            Router.push('/mall/login');
        } else {
            Router.push('/mall/profile');
        }
    };

    const logo = () => {
        Router.push('/mall');
    };


    useEffect(() => {
        const checkLoginStatus = () => {
            const userToken = localStorage.getItem('token');
            setIsLoggedIn(!!userToken);
        };
        checkLoginStatus();
        fetchCartCount(); // 컴포넌트 마운트 시 장바구니 개수 불러오기
        Router.events.on('routeChangeComplete', checkLoginStatus);

        return () => {
            Router.events.off('routeChangeComplete', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            Router.push('/');
            alert('로그아웃 되었습니다.');
        }
    };
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const checkLoginStatus = () => {
            const userToken = localStorage.getItem('token');
            setIsLoggedIn(!!userToken);
        };
        checkLoginStatus();
        fetchCartCount();
        Router.events.on('routeChangeComplete', () => {
            checkLoginStatus();
            setIsMenuOpen(false); // 페이지 이동 시 메뉴 닫기
        });

        return () => {
            Router.events.off('routeChangeComplete', checkLoginStatus);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.logoContainer} onClick={logo}>
                    <Image
                        src="/main.png"
                        alt="로고"
                        width={150}
                        height={50}
                    />
                </div>
                
                <nav className={`${styles.navContainer} ${isMenuOpen ? styles.navOpen : ''}`}>
                    <span className={styles.navItem} onClick={() => Router.push('/')}>HOME</span>
                    <span className={styles.navItem} onClick={() => Router.push('/mall/product')}>PRODUCTS</span>
                    <span className={styles.navItem} onClick={() => Router.push('/ev-guide')}>EV GUIDE</span>
                    <span className={styles.navItem} onClick={() => Router.push('/cs')}>CS</span>
                </nav>

                <div className={styles.iconContainer}>
                    <div className={styles.cartIconContainer} onClick={cart}>
                        <ShoppingOutlined className={styles.icon} />
                        {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
                    </div>
                    <UserOutlined className={styles.icon} onClick={profile} />
                    {isLoggedIn && (
                        <LoginOutlined className={styles.icon} onClick={handleLogout} />
                    )}
                </div>
                <button 
                className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonActive : ''}`} 
                onClick={toggleMenu}
            >
                <MenuOutlined />
            </button>
            </div>
        </header>
    );
};

export default MallHeader;
