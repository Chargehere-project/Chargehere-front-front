import Image from 'next/image';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Input, Button } from 'antd'; // 추가: antd에서 필요한 컴포넌트 import

const Header = () => {
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
        Router.push('/chargemain');
    };

    const mall = () => {
        Router.push('/mall');
    };

    const search = () => {
        // 검색 처리 로직 추가 필요
        console.log('Search initiated'); // 예시 로그
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Image src="http://localhost:8000/uploads/main.png" alt="logo" width={100} height={50} onClick={logo} />
            {/* 추가 시작: 검색창 자리 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="상품 또는 브랜드를 입력하세요"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            console.log('Pressed enter');
                            search();
                        }
                    }}
                    // onChange={(event) => setSearchInput(event.target.value)} // setSearchInput 필요
                    style={{ width: 400, marginRight: '10px' }} // 스타일 추가
                />
                <Button onClick={search}>검색</Button>
            </div>
            {/* 추가 끝 */}
            <div>
                <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={profile} />
                <ShopOutlined style={{ fontSize: '30px' }} onClick={mall} />
            </div>
        </header>
    );
};

export default Header;
