import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { UserOutlined, ShoppingOutlined, LoginOutlined, MenuOutlined } from '@ant-design/icons';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import HeaderStyled from './styled';

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
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/count`, {
                    userId: user
                });
                setCartCount(response.data.count);
            } catch (error) {
                console.error('장바구니 개수 불러오기 에러:', error);
            }
        }
    };

    const handleNavigation = (path: string) => {
        const user = token();
        if (user || path === '/mall/login') {
            Router.push(path);
        } else {
            alert('로그인이 필요합니다.');
            Router.push('/mall/login');
        }
    };

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            Router.push('/');
            alert('로그아웃 되었습니다.');
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const checkLoginStatus = () => {
            const userToken = localStorage.getItem('token');
            setIsLoggedIn(!!userToken);
        };
        
        // 장바구니 업데이트 이벤트 리스너 추가
        const handleCartUpdate = () => {
            fetchCartCount();
        };

        checkLoginStatus();
        fetchCartCount();

        // 커스텀 이벤트 리스너 등록
        window.addEventListener('cartUpdated', handleCartUpdate);

        Router.events.on('routeChangeComplete', () => {
            checkLoginStatus();
            fetchCartCount(); // 페이지 이동할 때마다 카운트 업데이트
            setIsMenuOpen(false);
        });

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            Router.events.off('routeChangeComplete', checkLoginStatus);
        };
    }, []);

    return (
        <HeaderStyled>
            <header className="header">
                <div className="headerContent">
                    <div className="logoContainer" onClick={() => Router.push('/')}>
                        <Image src="/main.png" alt="로고" width={150} height={50} />
                    </div>

                    <nav className={`navContainer ${isMenuOpen ? 'navOpen' : ''}`}>
                        <span className="navItem" onClick={() => Router.push('/mall')}>HOME</span>
                        <span className="navItem" onClick={() => Router.push('/mall/product')}>PRODUCTS</span>
                        <span className="navItem" onClick={() => Router.push('/mall/evguide/1')}>EV GUIDE</span>
                        <span className="navItem" onClick={() => Router.push('/mall/cs')}>CS</span>
                    </nav>

                    <div className="iconContainer">
                        <UserOutlined className="icon" onClick={() => handleNavigation('/mall/profile')} />
                        <div className="cartIconContainer" onClick={() => handleNavigation(`/mall/cart/${token()}`)}>
                            <ShoppingOutlined className="icon" />
                            {cartCount > 0 && <span className="cartCount">{cartCount}</span>}
                        </div>
                        {isLoggedIn && <LoginOutlined className="icon" onClick={handleLogout} />}
                    </div>
                    <button
                        className={`menuButton ${isMenuOpen ? 'menuButtonActive' : ''}`}
                        onClick={toggleMenu}
                    >
                        <MenuOutlined />
                    </button>
                </div>
            </header>
        </HeaderStyled>
    );
};

export default MallHeader;
