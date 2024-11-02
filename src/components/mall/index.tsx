import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swipe from './Swipe';
import { ArrowUpOutlined } from '@ant-design/icons';

interface Product {
  ProductID: number;
  ProductName: string;
  Price: number;
  Discount: number;
  Image: string;
}

const MallIndex = () => {
  const [bestProducts, setBestProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 주문이 많은 상품 8개 가져오기
    const fetchBestProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products/best');
        setBestProducts(response.data.data.slice(0, 8)); // 8개로 제한하기
      } catch (error) {
        console.error('Best 상품 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    // 신상품 8개 (ID 역순) 가져오기
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products/new');
        setNewProducts(response.data.data.slice(0, 8)); // 8개로 제한하기
      } catch (error) {
        console.error('신상품 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    // 할인율이 높은 상품 8개 가져오기
    const fetchSaleProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products/sale');
        setSaleProducts(response.data.data.slice(0, 8)); // 8개로 제한하기
      } catch (error) {
        console.error('Sale 상품 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    fetchBestProducts();
    fetchNewProducts();
    fetchSaleProducts();
  }, []);

  return (
    <div>
      <Swipe />
      {/* Best 섹션 */}
      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Best</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {bestProducts.map((product) => (
            <div
              key={product.ProductID}
              style={{
                width: '22%',
                marginBottom: '20px',
                backgroundColor: '#F2F2F2',
                padding: '10px',
                textAlign: 'center',
                borderRadius: '10px',
              }}
            >
              <img
                src={product.Image}
                alt={product.ProductName}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <h3>{product.ProductName}</h3>
              <p>가격: {product.Price.toLocaleString()}원</p>
            </div>
          ))}
        </div>
      </section>
      {/* 신상품 섹션 */}
      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>신상품</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {newProducts.map((product) => (
            <div
              key={product.ProductID}
              style={{
                width: '22%',
                marginBottom: '20px',
                backgroundColor: '#F2F2F2',
                padding: '10px',
                textAlign: 'center',
                borderRadius: '10px',
              }}
            >
              <img
                src={product.Image}
                alt={product.ProductName}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <h3>{product.ProductName}</h3>
              <p>가격: {product.Price.toLocaleString()}원</p>
            </div>
          ))}
        </div>
      </section>
      {/* Sale 섹션 */}
      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Sale</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {saleProducts.map((product) => (
            <div
              key={product.ProductID}
              style={{
                width: '22%',
                marginBottom: '20px',
                backgroundColor: '#F2F2F2',
                padding: '10px',
                textAlign: 'center',
                borderRadius: '10px',
              }}
            >
              <img
                src={product.Image}
                alt={product.ProductName}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <h3>{product.ProductName}</h3>
              <p>가격: {product.Price.toLocaleString()}원</p>
              <p>할인율: {product.Discount}%</p>
            </div>
          ))}
        </div>
      </section>
      {/* 페이지 상단으로 이동하는 화살표 버튼 */}
      <button
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          padding: '10px',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpOutlined style={{ fontSize: '20px' }} />
      </button>
    </div>
  );
};

export default MallIndex;