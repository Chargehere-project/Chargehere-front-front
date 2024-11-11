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

const MallIndex: React.FC = () => {
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
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
  }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/mall/product/${productId}`);
  };

  return (
    <div>
      <Swipe />

      {/* Category Section */}
      <section style={styles.categorySection}>
        <div style={styles.categoryCard} onClick={() => router.push('/map')}>
          <img src="/charge_charge.png" alt="Charge" style={styles.categoryImage} />
          <p>CHARGE</p>
        </div>
        <div style={styles.categoryCard} onClick={() => router.push('/mall/product')}>
          <img src="/charge_shop.png" alt="Shopping" style={styles.categoryImage} />
          <p>SHOPPING</p>
        </div>
        <div style={styles.categoryCard} onClick={() => router.push('/ev-guide')}>
          <img src="/charge_evguide.png" alt="EV Guide" style={styles.categoryImage} />
          <p>EV GUIDE</p>
        </div>
      </section>

      {/* Attendance Section */}
      <section style={styles.attendanceSection}>
        <h2>출석 체크 하기</h2>
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
  categorySection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '1400px',  // 카테고리 섹션 전체 너비
  },
  categoryCard: {
    width: '388px',    // 각 카드 너비
    height: '500px',   // 각 카드 높이
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
  attendanceSection: {
    width: '1400px',
    height: '300px',
    marginTop: '20px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#666',
    color: '#fff',
    fontSize: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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