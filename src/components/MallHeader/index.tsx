import Image from 'next/image';
import Router from 'next/router';
import {jwtDecode} from 'jwt-decode';
import { UserOutlined, ShoppingOutlined, LoginOutlined, SearchOutlined } from '@ant-design/icons';
const MallHeader = () => {

    const token = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.UserID;  // 토큰에서 UserID를 추출
        } catch (error) {
            console.error('토큰 디코드 에러:', error);
            return null;
        }
    };
    const profile = () =>{
        const user = token()
        if(!user){
            alert('로그인이 필요합니다.')
            return
        }else{
            Router.push('/profile')
        }
    }
    
    const logo = () =>{
        Router.push('/mall')
    }
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center' }}>
      {/* 로고 */}
      <div style={{ display: 'flex', alignItems: 'center' }} onClick={logo}>
        <Image src="/main.png" alt="logo" width={100} height={50} />
      </div>
      {/* 아이콘이랑 검색 영역 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 장바구니 */}
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <ShoppingOutlined style={{ fontSize: '30px' }} />
        </div>
        {/* 마이페이지 */}
        <div style={{ textAlign: 'center', marginRight: '20px' }} onClick={profile}>
          <UserOutlined style={{ fontSize: '30px' }} />
        </div>
        {/* 로그인 */}
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <LoginOutlined style={{ fontSize: '30px' }} />
        </div>
        {/* 검색 */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <SearchOutlined style={{ fontSize: '30px' }} />
        </div>
      </div>
    </header>
  );
};
export default MallHeader;