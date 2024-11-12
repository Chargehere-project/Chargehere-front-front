import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Swipe from './Swipe';

interface Product {
  ProductID: number;
  ProductName: string;
  Price: number;
  Discount: number;
  Image: string;
}

const MallIndex = () => {
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 추가
  const router = useRouter();

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        setBestProducts(response.data.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching best products', error);
      }
    };

    fetchBestProducts();

    // 로그인 상태 확인 (예: 토큰을 확인하는 방식)
    const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
    setIsLoggedIn(!!token); // 토큰이 존재하면 로그인 상태를 true로 설정
  }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/mall/product/${productId}`);
  };

  const handleAttendanceClick = () => {
    if (isLoggedIn) {
      router.push('/roulette'); // 로그인되어 있으면 roulette 페이지로 이동
    } else {
      router.push('/mall/login'); // 로그인되어 있지 않으면 로그인 페이지로 이동
    }
  };

  return (
    <div style={styles.container}>
      <Swipe />

      {/* Category Section */}
      <section style={styles.categorySection}>
        <div style={styles.categoryCard} onClick={() => router.push('/map')}>
          <img src="/charge_charge.png" alt="Charge" style={styles.categoryImage} />
          <p style={styles.categoryText}>CHARGE</p>
        </div>
        <div style={styles.categoryCard} onClick={() => router.push('/mall/product')}>
          <img src="/charge_shop.png" alt="Shopping" style={styles.categoryImage} />
          <p style={styles.categoryText}>SHOPPING</p>
        </div>
        <div style={styles.categoryCard} onClick={() => router.push('/ev-guide')}>
          <img src="/charge_evguide.png" alt="EV Guide" style={styles.categoryImage} />
          <p style={styles.categoryText}>EV GUIDE</p>
        </div>
      </section>

      {/* Attendance Section */}
      <section style={styles.attendanceSection} onClick={handleAttendanceClick}>
        <h2>출석 체크 하기</h2>
      </section>

      {/* Recommended Products Section */}
      <section style={styles.recommendedSection}>
        <h2 style={styles.recommendedTitle}>추천 상품</h2>
        <div style={styles.productContainer}>
          {bestProducts.slice(0, 2).map((product) => (
            <div key={product.ProductID} style={styles.productCard} onClick={() => handleProductClick(product.ProductID)}>
              <img src={product.Image} alt={product.ProductName} style={styles.productImage} />
              <p style={styles.productName}>{product.ProductName}</p>
              <p style={styles.productPrice}>{product.Price.toLocaleString()}원</p>
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/mall/product')} style={styles.viewMoreButton}>상품 더보기</button>
      </section>

      {/* Scroll to Top Button */}
      <button
        style={styles.scrollTopButton}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpOutlined style={{ fontSize: '20px' }} />
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
  },
  categorySection: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '50px 20px',
  },
  categoryCard: {
    position: 'relative',
    width: '30%',
    height: '400px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f2f2f2',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '30px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  attendanceSection: {
    width: '100%',
    height: '80px',
    marginTop: '20px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#555555',
    color: '#fff',
    fontSize: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  recommendedSection: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  recommendedTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  productContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  productCard: {
    width: '200px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '15px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  productImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  productPrice: {
    fontSize: '14px',
    color: '#333',
  },
  viewMoreButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#000000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  scrollTopButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
} as const;

export default MallIndex;
