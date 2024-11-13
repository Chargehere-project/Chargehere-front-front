import styled from 'styled-components';

export const ItemContainer = styled.div`
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

export const ProductImage = styled.img`
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    margin-bottom: 12px;
`;

export const ProductTitle = styled.h3`
    font-size: 16px;
    font-weight: 500;
    margin: 8px 0;
    color: #333;
`;

export const Price = styled.p`
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-top: 4px;
`;