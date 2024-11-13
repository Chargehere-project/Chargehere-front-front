import Image from 'next/image';
import { UserOutlined, ShopOutlined, LoginOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        // S3에서 로고 URL을 가져오는 API 호출
        const fetchLogoUrl = async () => {
            try {
                const response = await fetch('/api/admin/getLogoUrl');
                const data = await response.json();
                setLogoUrl(data.logoUrl || '/main.png');
            } catch (error) {
                console.error('로고 URL 가져오기 실패:', error);
                setLogoUrl('/main.png');
            }
        };
        fetchLogoUrl();

        // 로그인 상태 확인
        const token = localStorage.getItem('token');
        if (token) setIsLoggedIn(true);
    }, []);

    const token = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.UserID; // 토큰에서 UserID 추출
        } catch (error) {
            console.error('토큰 디코드 에러:', error);
            return null;
        }
    };

    const profile = () => {
        const user = token();
        if (!user) {
            Router.push('/mall/login');
        } else {
            Router.push('/mall/profile');
        }
    };

    const mall = () => {
        Router.push('/mall');
    };

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            setIsLoggedIn(false); // 로그아웃 시 상태 업데이트
            Router.push('/');
            alert('로그아웃 되었습니다.');
        }
    };

    return (
        <header style={headerStyle}>
            <Image
                src={logoUrl || '/main.png'}
                alt="로고"
                width={100}
                height={50}
                onClick={() => Router.push('/chargemain')}
                style={{ cursor: 'pointer' }}
            />
            <div style={iconContainerStyle}>
                <UserOutlined style={iconStyle} onClick={profile} />
                {isLoggedIn && <LoginOutlined style={iconStyle} onClick={handleLogout} />}
                <ShopOutlined style={iconStyle} onClick={mall} />
            </div>
        </header>
    );
};

// 인라인 스타일
const headerStyle = {
    position: 'fixed' as 'fixed', // 상단 고정
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
};

const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
};

const iconStyle = {
    fontSize: '30px',
    marginRight: '20px',
    cursor: 'pointer',
};

export default Header;
