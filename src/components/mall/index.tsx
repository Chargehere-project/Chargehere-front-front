import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Swipe from './Swipe';
import MallStyled from './styled';

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
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get<UserSession>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(!!response.data.userId); // userId가 존재하면 로그인 상태로 간주
        } catch (error) {
          console.error('Error verifying user session', error);
          setIsLoggedIn(false);
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
      router.push('/roulette');
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