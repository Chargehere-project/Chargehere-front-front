import styled from 'styled-components';

export const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

export const ProductSection = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 100px;

    @media screen and (max-width: 768px) {
        flex-direction: column; /* 이미지가 위에 오고 정보가 아래로 정렬 */
    }
`;

export const ImageSection = styled.div`
    flex: 1;

    @media screen and (max-width: 768px) {
        margin-bottom: 20px; /* 이미지와 아래 정보 사이에 간격 추가 */
    }
`;

export const InfoSection = styled.div`
    margin-left: 10px;
    flex: 1;

    @media screen and (max-width: 768px) {
        margin-left: 0; /* 세로 정렬 시 왼쪽 여백 제거 */
    }
`;

export const ProductTitle = styled.h1`
    font-size: 32px;
    margin: 10px 0;

    @media screen and (max-width: 768px) {
        font-size: 28px; /* 작은 화면에서 폰트 크기 조정 */
        text-align: center; /* 가운데 정렬 */
    }
`;

export const ProductPrice = styled.p`
    font-size: 18px;
    margin: 8px 0;

    @media screen and (max-width: 768px) {
        font-size: 16px; /* 작은 화면에서 폰트 크기 조정 */
        text-align: center; /* 가운데 정렬 */
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 30px;

    @media screen and (max-width: 768px) {
        flex-direction: column; /* 작은 화면에서 버튼을 위아래로 정렬 */
        align-items: center; /* 버튼을 가운데 정렬 */
        width: 100%;
    }
`;

export const BuyButton = styled.button`
    width: 200px;
    height: 45px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #888;
        
    }

    @media screen and (max-width: 768px) {
        width: 100%; /* 작은 화면에서 버튼 너비를 100%로 설정 */
    }
`;

export const CartButton = styled.button`
    width: 200px;
    height: 45px;
    background-color: white;
    color: black;
    border: 2px solid black;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: #888;
        color: white;
        border: none;
    }

    @media screen and (max-width: 768px) {
        width: 100%; /* 작은 화면에서 버튼 너비를 100%로 설정 */
    }
`;

export const ShippingInfoContainer = styled.div`
    margin-top: 16px;
    padding: 16px;
    background-color: white;
    border-radius: 8px;
`;

export const ShippingInfoTitle = styled.h3`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;

    @media screen and (max-width: 768px) {
        text-align: center; /* 작은 화면에서 가운데 정렬 */
    }
`;

export const ShippingSectionTitle = styled.h4`
    font-weight: 600;
    margin-bottom: 8px;

    @media screen and (max-width: 768px) {
        text-align: center; /* 작은 화면에서 가운데 정렬 */
    }
`;

export const ShippingText = styled.p`
    margin: 4px 0;
    color: #666;

    @media screen and (max-width: 768px) {
        text-align: center; /* 작은 화면에서 텍스트 가운데 정렬 */
    }
`;

export const TabsContainer = styled.div`
    margin-top: 40px;
`;

