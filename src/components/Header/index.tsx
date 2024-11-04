import Image from 'next/image';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Input, Button } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
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
            return decoded.UserID;
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
        Router.push('/chargemain');
    };

    const mall = () => {
        Router.push('/mall');
    };

    const search = () => {
        if (searchInput.trim()) {
            Router.push(`/search?keyword=${encodeURIComponent(searchInput)}`);
        }
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Image src="http://localhost:8000/uploads/main.png" alt="logo" width={100} height={50} onClick={logo} />
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
            <div>
                <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={profile} />
                <ShopOutlined style={{ fontSize: '30px' }} onClick={mall} />
            </div>
        </header>
    );
};

export default Header;