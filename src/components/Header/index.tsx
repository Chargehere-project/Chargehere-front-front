import Image from 'next/image';
import { UserOutlined, ShopOutlined, LoginOutlined } from '@ant-design/icons';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Input, Button } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Header = () => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    useEffect(() => {
        // S3에서 로고 URL을 가져오는 API 호출 (이 부분은 실제 API 엔드포인트로 대체해야 합니다)
        const fetchLogoUrl = async () => {
            try {
                const response = await fetch('/api/admin/getLogoUrl'); // 예시 API 호출
                const data = await response.json();
                setLogoUrl(data.logoUrl || '/main.png'); // S3에서 로고 URL을 가져옴
            } catch (error) {
                console.error('로고 URL 가져오기 실패:', error);
                setLogoUrl('/main.png'); // 기본 로고 설정
            }
        };
        fetchLogoUrl();
    }, []);
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
       Router.push('/chargemain')
   }
   const mall = () =>{
       Router.push('/mall')
   }
   return (
       <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
           <Image src={logoUrl || '/main.png'} alt="logo" width={100} height={50} onClick={logo}/>
           <div>
               <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={profile}/>
               <ShopOutlined style={{ fontSize: '30px' }} onClick={mall}/>
           </div>
       </header>
   );
};
export default Header;