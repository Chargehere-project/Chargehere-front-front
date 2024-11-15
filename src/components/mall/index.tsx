import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import Swipe from './Swipe';
import MallStyled from './styled';
import { jwtDecode } from 'jwt-decode'; 

interface Product {
  ProductID: number;
  ProductName: string;
  Price: number;
  Discount: number;
  Image: string;
}

interface UserSession {
  userId: number;
}

const MallIndex = () => {
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 상품 목록을 가져오는 함수
    const fetchBestProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        setBestProducts(response.data.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching best products', error);
      }
    };

    // 로그인 여부를 확인하는 함수
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
          try {
              // 토큰 디코드하여 userId 가져오기
              const decoded: any = jwtDecode(token);
              const userId = decoded.UserID;
  
              const response = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
                  { userId },  // userId를 request body에 포함
                  {
                      headers: { 
                          Authorization: `Bearer ${token}`
                      }
                  }
              );
              
              if(response.data.result) {
                  setIsLoggedIn(true);
              } else {
                  setIsLoggedIn(false);
                  localStorage.removeItem('token');
              }
          } catch (error) {
              console.error('Error verifying user session', error);
              setIsLoggedIn(false);
              localStorage.removeItem('token');
          }
      } else {
          setIsLoggedIn(false);
      }
  };
  
  fetchBestProducts();
  checkUserSession();
  }, []);

  // 상품 클릭 시 페이지 이동
  const handleProductClick = (productId: number) => {
    router.push(`/mall/product/${productId}`);
  };

  // 출석 체크 누르면 로그인 여부에 따라 페이지
  const handleAttendanceClick = () => {
    if (isLoggedIn) {
      router.push('/roullette');
    } else {
      router.push('/mall/login');
    }
  };

  return (
    <MallStyled>
      <div className='container'>
        <Swipe />

        {/* 카테고리 버튼 섹션 */}
        <section className='categorySection'>
          <div className='categoryCard' onClick={() => router.push('/map')}>
            <img src="/charge_charge.png" alt="Charge" className='categoryImage' />
            <p className='categoryText'>CHARGE</p>
          </div>
          <div className='categoryCard' onClick={() => router.push('/mall/product')}>
            <img src="/charge_shop.png" alt="Shopping" className='categoryImage' />
            <p className='categoryText'>SHOPPING</p>
          </div>
          <div className='categoryCard' onClick={() => router.push('/mall/evguide/1')}>
            <img src="/charge_evguide.png" alt="EV Guide" className='categoryImage' />
            <p className='categoryText'>EV GUIDE</p>
          </div>
        </section>

        {/* 출석 체크 버튼 섹션 */}
        <section className='attendanceSection' onClick={handleAttendanceClick}>
          <h2>출석 체크 하기</h2>
        </section>

        {/* 추천 상품 섹션 */}
        <section className='recommendedSection'>
          <h2 className='recommendedTitle'>추천 상품</h2>
          <div className='productContainer'>
            {bestProducts.slice(0, 2).map((product) => (
              <div key={product.ProductID} className='productCard' onClick={() => handleProductClick(product.ProductID)}>
                <img src={product.Image} alt={product.ProductName} className='productImage' />
                <p className='productName'>{product.ProductName}</p>
                <p className='productPrice'>{product.Price.toLocaleString()}원</p>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/mall/product')} className='viewMoreButton'>상품 더보기</button>
        </section>

        <Button
          type="primary"
          shape="circle"
          icon={<QrcodeOutlined style={{ fontSize: '25px' }} />} // QR 코드
          className="qrButton"
          onClick={() => router.push('/charging')}
        />

        {/* 위로 올리기 버튼 */}
        <button
          className='scrollTopButton'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUpOutlined style={{ fontSize: '20px' }} />
        </button>
      </div>
    </MallStyled>
  );
};

export default MallIndex;