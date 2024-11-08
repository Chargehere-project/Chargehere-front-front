import Image from 'next/image';
import { UserOutlined, ShopOutlined, LoginOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Input, Button } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    // useEffect(() => {
    //     // S3에서 로고 URL을 가져오는 API 호출 (이 부분은 실제 API 엔드포인트로 대체해야 합니다)
    //     const fetchLogoUrl = async () => {
    //         try {
    //             const response = await fetch('/api/admin/getLogoUrl'); // 예시 API 호출
    //             const data = await response.json();
    //             setLogoUrl(data.logoUrl || '/charge_logo.png'); // S3에서 로고 URL을 가져옴
    //         } catch (error) {
    //             console.error('로고 URL 가져오기 실패:', error);
    //             setLogoUrl('/charge_logo.png'); // 기본 로고 설정
    //         }
    //     };
    //     fetchLogoUrl();
    // }, []);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        // 초기 체크
        checkLoginStatus();

        // 라우터 이벤트에 리스너 추가
        Router.events.on('routeChangeComplete', checkLoginStatus);

        return () => {
            Router.events.off('routeChangeComplete', checkLoginStatus);
        };
    }, []);
    const token = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.UserID; // 토큰에서 UserID를 추출
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
    const logo = () => {
        Router.push('/chargemain');
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
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/charge_logo.png`}
                alt="로고"
                width={300}
                height={100}
            />
            <div>
                <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={profile} />
                <ShopOutlined style={{ fontSize: '30px' }} onClick={mall} />
                {isLoggedIn && (
                    <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={handleLogout}>
                        <LoginOutlined style={{ fontSize: '30px' }} />
                    </div>
                )}
            </div>
        </header>
    );
};
export default Header;
