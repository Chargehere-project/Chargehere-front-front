import Image from 'next/image';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { UserOutlined, ShoppingOutlined, LoginOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd'; // antd 컴포넌트 import
import axios from 'axios';


const MallHeader = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
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
        const response = await axios.get(`http://localhost:8000/search`, {
            params: {
                query: searchInput
            }
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

    const profile = () => {
        const user = token();
        if (!user) {
            alert('로그인이 필요합니다.');

            Router.push('/login');
        } else {
            Router.push('/profile');
        }
    };

    const logo = () => {
        Router.push('/mall');
    };
               const search = () => {
        // 검색 처리 로직 추가 필요
        console.log('Search initiated'); // 예시 로그
    };


    const handleLogout = () => {
        // 사용자에게 로그아웃 확인
        if (window.confirm('로그아웃 하시겠습니까?')) {
            // localStorage에서 토큰 제거
            localStorage.removeItem('token');
            // 메인 페이지로 이동
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

            <Input
                    placeholder="상품 또는 브랜드를 입력하세요"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            console.log('Pressed enter');
                            search();
                        }
                    }}
                    style={{ width: 500, marginRight: '10px' }} // 스타일 추가
                />
                {/* 장바구니 */}
                <div style={{ textAlign: 'center', marginRight: '20px' }}>
                    <ShoppingOutlined style={{ fontSize: '30px' }} />
                </div>
                {/* 마이페이지 */}
                <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={profile}>
                    <UserOutlined style={{ fontSize: '30px' }} />
                </div>
                {/* 로그아웃 */}
                <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={handleLogout}>
                    <LoginOutlined style={{ fontSize: '30px' }} />
                </div>
                {/* 검색 */}
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Input
                        placeholder="상품 또는 브랜드를 입력하세요"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                search();
                            }
                        }}
                        style={{ width: 400, marginRight: '10px' }}
                    />
                    <Button onClick={search}>검색</Button>
                </div>
                {searchResults.length > 0 && searchInput && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        width: '400px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        zIndex: 1000,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        {searchResults.map((item: any, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee'
                                }}
                                onClick={() => Router.push(`/product/${item.ProductID}`)}
                            >
                                {item.ProductName} {/* 백엔드의 필드명에 맞게 수정 */}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            </div>
        </header>
    );
};

export default MallHeader;
