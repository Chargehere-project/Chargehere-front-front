import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Router from 'next/router';
import { UserOutlined, ShoppingOutlined, LoginOutlined, MenuOutlined } from '@ant-design/icons';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import HeaderStyled from './styled';
import { Modal } from 'antd';

interface CustomJwtPayload {
    userID: string;  // 소문자로 시작하는 경우
    // 다른 필요한 속성들
    iat?: number;
    exp?: number;
    [key: string]: any;
}
const MallHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string>('/main.png'); // 기본 로고 설정

    // 사용자 토큰에서 UserID 가져오기
   const token = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        const decoded = jwtDecode<CustomJwtPayload>(token); // 제네릭 타입 지정
        return decoded.UserID; // userId 반환
    } catch (error) {
        console.error('토큰 디코드 에러:', error);
        return null;
    }
};

    // S3에서 로고 URL 가져오기
    const fetchLogo = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/files/logo`);
            setLogoUrl(response.data.fileUrl || '/main.png'); // S3 로고가 없으면 기본 로고 사용
        } catch (error) {
            console.error('로고 가져오기 실패:', error);
            setLogoUrl('/main.png'); // 에러 발생 시 기본 로고 사용
        }
    };

    // 장바구니 개수 가져오기
    const fetchCartCount = async () => {
        const user = token();
        if (user) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/count`, {
                    userId: user,
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
            Modal.warning({
                title: '로그인 필요',
                content: '로그인이 필요합니다.',
                onOk() {
                    Router.push('/mall/login');
                },
            });
        }
    };

    const handleLogout = () => {

        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token'); // 토큰 제거
            setIsLoggedIn(false); // 로그인 상태 해제
            setCartCount(0); // 장바구니 개수 초기화
            Router.push('/');
            alert('로그아웃 되었습니다.');
        }

        Modal.confirm({
            title: '로그아웃 확인',
            content: '로그아웃 하시겠습니까?',
            onOk() {
                localStorage.removeItem('token'); // 토큰 제거
                setIsLoggedIn(false);            // 로그인 상태 해제
                setCartCount(0);                 // 장바구니 개수 초기화
                Router.push('/');
                Modal.info({
                    title: '로그아웃 완료',
                    content: '로그아웃 되었습니다.',
                });
            },
        });

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
        fetchLogo(); // 컴포넌트 마운트 시 로고 가져오기

        // 커스텀 이벤트 리스너 등록
        window.addEventListener('cartUpdated', handleCartUpdate);

        Router.events.on('routeChangeComplete', () => {
            checkLoginStatus();
            fetchCartCount(); // 페이지 이동할 때마다 카운트 업데이트
            setIsMenuOpen(false);
        });

        // 로고 업데이트를 감지하는 이벤트 리스너 추가 (예: 로고가 변경될 때마다 새로고침 없이 반영)
        const handleLogoUpdate = () => {
            fetchLogo();
        };
        window.addEventListener('logoUpdated', handleLogoUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('logoUpdated', handleLogoUpdate);
            Router.events.off('routeChangeComplete', checkLoginStatus);
        };
    }, []);

    return (
        <HeaderStyled>
            <header className="header">
                <div className="headerContent">
                    <div className="logoContainer" onClick={() => Router.push('/')}>
                        <Image src={logoUrl} alt="로고" width={150} height={50} />
                    </div>

                    <nav className={`navContainer ${isMenuOpen ? 'navOpen' : ''}`}>
                        <span className="navItem" onClick={() => Router.push('/mall')}>
                            HOME
                        </span>
                        <span className="navItem" onClick={() => Router.push('/mall/product')}>
                            PRODUCTS
                        </span>
                        <span className="navItem" onClick={() => Router.push('/mall/evguide/1')}>
                            EV GUIDE
                        </span>
                        <span className="navItem" onClick={() => Router.push('/mall/cs')}>
                            CS
                        </span>
                    </nav>

                    <div className="iconContainer">
                        <UserOutlined className="icon" onClick={() => handleNavigation('/mall/profile')} />
                        <div
                            className="cartIconContainer"
                            onClick={() => handleNavigation(`/mall/cart/${token()}`)}
                            style={{ marginTop: '5px' }}>
                            <ShoppingOutlined className="icon" />
                            {cartCount > 0 && <span className="cartCount">{cartCount}</span>}
                        </div>
                        {isLoggedIn && (
                            <LoginOutlined className="icon" onClick={handleLogout} style={{ fontSize: '24px' }} />
                        )}
                    </div>
                    <button className={`menuButton ${isMenuOpen ? 'menuButtonActive' : ''}`} onClick={toggleMenu}>
                        <MenuOutlined />
                    </button>
                </div>
            </header>
        </HeaderStyled>
    );
};

export default MallHeader;
