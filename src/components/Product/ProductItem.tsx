import React from 'react';
import Router from 'next/router';
import { ItemContainer, ProductImage, ProductTitle, Price } from '../../styles/ProductItem.styles';

interface ProductItemProps {
    ProductID: number;
    Image: string;
    ProductName: string;
    Discount: number;
    Price: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ ProductID, Image, ProductName, Discount, Price: price }) => {
    const defaultImage = '/images/default.jpg';

    const handleClick = () => {
        Router.push(`product/${ProductID}`);
    };

    return (
        <ItemContainer onClick={handleClick}>
            <ProductImage
                src={Image}
                alt={ProductName}
                onError={(e) => {
                    e.currentTarget.src = defaultImage;
                }}
            />
            <ProductTitle>{ProductName}</ProductTitle>
            <Price>{price.toLocaleString()}원</Price>
        </ItemContainer>
    );
};

export default ProductItem;