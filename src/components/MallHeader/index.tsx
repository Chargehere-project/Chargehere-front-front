import Image from 'next/image';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { UserOutlined, ShoppingOutlined, LoginOutlined } from '@ant-design/icons';
import axios from 'axios';

const MallHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);

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

    return (
        <header style={headerStyle}>
            <div style={headerContentStyle}>
                <div style={logoContainerStyle} onClick={logo}>
                    <Image
                        src="/main.png" 
                        alt="로고"
                        width={150}
                        height={50}
                    />
                </div>
                <nav style={navContainerStyle}>
                    <span style={navItemStyle} onClick={() => Router.push('/')}>HOME</span>
                    <span style={navItemStyle} onClick={() => Router.push('/mall/product')}>PRODUCTS</span>
                    <span style={navItemStyle} onClick={() => Router.push('/mall/evguide/1')}>EV GUIDE</span>
                    <span style={navItemStyle} onClick={() => Router.push('/mall/cs')}>CS</span>
                </nav>
                <div style={iconContainerStyle}>
                    <div style={cartIconContainer} onClick={cart}>
                        <ShoppingOutlined style={iconStyle} />
                        {cartCount > 0 && <span style={cartCountStyle}>{cartCount}</span>}
                    </div>
                    <UserOutlined style={iconStyle} onClick={profile} />
                    {isLoggedIn && (
                        <LoginOutlined style={iconStyle} onClick={handleLogout} />
                    )}
                </div>
            </div>
        </header>
    );
};

const headerStyle = {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%', // 전체 화면 너비로 설정
    height: '70px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center', // 중앙 정렬을 위해 사용
};

const headerContentStyle = {
    width: '100%', // 내부 콘텐츠의 최대 너비를 1400px로 제한하여 중앙에 정렬되도록 함
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
};

const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
};

const navContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
};

const navItemStyle = {
    fontSize: '16px',
    cursor: 'pointer',
    color: '#333',
    fontWeight: 'bold' as 'bold',
};

const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
};

const iconStyle = {
    fontSize: '24px',
    marginLeft: '20px',
    cursor: 'pointer',
};

const cartIconContainer = {
    position: 'relative' as 'relative',
};

const cartCountStyle = {
    position: 'absolute' as 'absolute',
    top: '-5px',
    right: '-10px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
};

export default MallHeader;
