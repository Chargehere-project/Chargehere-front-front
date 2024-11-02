import React from 'react';

interface ProductItemProps {
    id: number; // id 추가
    image: string;
    name: string;
    discount: number;
    price: number;
    details: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, image, name, discount, price, details }) => {
    const defaultImage = '/images/default.jpg'; // 기본 이미지 경로

    return (
        <div>
            <img
                src={image}
                alt={name}
                onError={(e) => {
                    e.currentTarget.src = defaultImage; // 이미지 로드 실패 시 기본 이미지로 대체
                }}
                style={{ width: '100%', height: 'auto' }}
            />
            <h3>{name}</h3>
            <p>{discount}% 할인</p>
            <p>{price}원</p>
            <p>{details}</p>
        </div>
    );
};

export default ProductItem;
