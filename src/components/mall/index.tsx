import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Swipe from './Swipe';
import styles from './MallIndex.module.css';

interface Product {
  ProductID: number;
  ProductName: string;
  Price: number;
  Discount: number;
  Image: string;
}

const MallIndex = () => {
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/mall/product/${productId}`);
  };

  const handleAttendanceClick = () => {
    if (isLoggedIn) {
      router.push('/roulette');
    } else {
      router.push('/mall/login');
    }
  };

  return (
    <div className={styles.container}>
      <Swipe />

      {/* 버튼 3개 있는데 */}
      <section className={styles.categorySection}>
        <div className={styles.categoryCard} onClick={() => router.push('/map')}>
          <img src="/charge_charge.png" alt="Charge" className={styles.categoryImage} />
          <p className={styles.categoryText}>CHARGE</p>
        </div>
        <div className={styles.categoryCard} onClick={() => router.push('/mall/product')}>
          <img src="/charge_shop.png" alt="Shopping" className={styles.categoryImage} />
          <p className={styles.categoryText}>SHOPPING</p>
        </div>
        <div className={styles.categoryCard} onClick={() => router.push('/ev-guide')}>
          <img src="/charge_evguide.png" alt="EV Guide" className={styles.categoryImage} />
          <p className={styles.categoryText}>EV GUIDE</p>
        </div>
      </section>

      {/* 출첵 부분 */}
      <section className={styles.attendanceSection} onClick={handleAttendanceClick}>
        <h2>출석 체크 하기</h2>
      </section>

      {/* 상품 추천 부분 */}
      <section className={styles.recommendedSection}>
        <h2 className={styles.recommendedTitle}>추천 상품</h2>
        <div className={styles.productContainer}>
          {bestProducts.slice(0, 2).map((product) => (
            <div key={product.ProductID} className={styles.productCard} onClick={() => handleProductClick(product.ProductID)}>
              <img src={product.Image} alt={product.ProductName} className={styles.productImage} />
              <p className={styles.productName}>{product.ProductName}</p>
              <p className={styles.productPrice}>{product.Price.toLocaleString()}원</p>
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/mall/product')} className={styles.viewMoreButton}>상품 더보기</button>
      </section>

      {/* 위로 올리기 부분 */}
      <button
        className={styles.scrollTopButton}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpOutlined style={{ fontSize: '20px' }} />
      </button>
    </div>
  );
};

export default MallIndex;
