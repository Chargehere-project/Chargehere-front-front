import React from 'react';
import Router from 'next/router';
import style from './profile.module.css';

interface ProductItemProps {
    ProductID: number;
    Image: string; // 백엔드 컬럼명에 맞게 수정
    ProductName: string; // 백엔드 컬럼명에 맞게 수정
    Discount: number; // 백엔드 컬럼명에 맞게 수정
    Price: number; // 백엔드 컬럼명에 맞게 수정
}

const ProductItem: React.FC<ProductItemProps> = ({ ProductID, Image, ProductName, Discount, Price }) => {
    const defaultImage = '/images/default.jpg'; // 기본 이미지 경로

    const Click = () => {
        Router.push(`product/${ProductID}`);
    };
    return (
        <div
            onClick={Click}
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
            }}
        >
            <img
                src={Image}
                alt={ProductName}
                onError={(e) => {
                    e.currentTarget.src = defaultImage; // 이미지 로드 실패 시 기본 이미지로 대체
                }}
                style={{ width: '100%', height: 'auto' }}
            />
            <h3>{ProductName}</h3>
            <p style={{ color: 'red', fontSize: '40px', fontWeight: 'bold' }}>{Discount}%</p>
            <div>
                <p style={{color:'#adb5bd', textDecoration:'line-through'}}>{Price}원</p>
                <p style={{fontWeight:'bold'}}>{(Price * (1 - Discount / 100)).toLocaleString()}원</p>
            </div>
        </div>
    );
};

export default ProductItem;
