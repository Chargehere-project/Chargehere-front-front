import Image from 'next/image';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { UserOutlined, ShoppingOutlined, LoginOutlined, SearchOutlined, CarOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd'; // antd 컴포넌트 import
import axios from 'axios';

const MallHeader = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchInput) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchInput]);

    const handleSearch = async () => {
        if (!searchInput.trim()) return;

        try {
            setIsSearching(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
                params: {
                    query: searchInput,
                },
            });

            // response.data에서 result와 data 구조 확인
            if (response.data.result) {
                setSearchResults(response.data.data || []);
            }
        } catch (error) {
            console.error('검색 에러:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

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
    const cart = () => {
        const user = token();
        if (!user) {
            alert('로그인이 필요합니다.');
            Router.push('/mall/login');
        } else {
            // 로그인된 사용자의 장바구니로 이동
            Router.push(`/mall/cart/${user}`); // 또는 그냥 '/cart'로 이동하고 서버에서 처리
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
        Router.push('/mall');
    };
    const search = () => {
        // 검색 처리 로직 추가 필요
        console.log('Search initiated'); // 예시 로그
    };

    const car = () => {
        Router.push('/chargemain');
    };
    useEffect(() => {
        const userToken = localStorage.getItem('token');
        setIsLoggedIn(!!userToken);
    }, []);

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            setIsLoggedIn(false); // 로그아웃 시 상태 업데이트
            Router.push('/');
            alert('로그아웃 되었습니다.');
        }
    };
    return (
        <header
            style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center' }}
        >
            {/* 로고 */}
            <div style={{ display: 'flex', alignItems: 'center' }} onClick={logo}>
                <Image src="http://localhost:8000/uploads/main.png" alt="logo" width={100} height={50} />
            </div>
            {/* 아이콘이랑 검색 영역 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* 전기차페이지 이동 */}
                <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={car}>
                    <CarOutlined style={{ fontSize: '30px' }} />
                </div>
                {/* 장바구니 */}
                <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={cart}>
                    <ShoppingOutlined style={{ fontSize: '30px' }} />
                </div>
                {/* 마이페이지 */}
                <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={profile}>
                    <UserOutlined style={{ fontSize: '30px' }} />
                </div>
                {/* 로그아웃 */}
                {isLoggedIn && (
                    <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={handleLogout}>
                        <LoginOutlined style={{ fontSize: '30px' }} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default MallHeader;
