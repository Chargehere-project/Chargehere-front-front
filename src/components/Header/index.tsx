import Image from 'next/image';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
import Router from 'next/router';
import {jwtDecode} from 'jwt-decode';



const Header = () => {
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
            Router.push('/login')
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
           <Image 
    src="http://localhost:8000/uploads/main.png"
    alt="logo" 
    width={100} 
    height={50} 
    onClick={logo}
/>
            <div>
                <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} onClick={profile}/>
                <ShopOutlined style={{ fontSize: '30px' }} onClick={mall}/>
            </div>
        </header>
    );
};
export default Header;
