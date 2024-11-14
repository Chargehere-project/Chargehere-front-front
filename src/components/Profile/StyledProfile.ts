import styled from 'styled-components';

export const ProfileContainer = styled.div`
    width: 90%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;

    @media (max-width: 1024px) {
        width: 100%;
        padding: 10px;
    }
`;

export const Title = styled.h1`
    font-size: 36px;
    font-weight: bold;
    color: #555;
    padding: 20px 0;

    @media (max-width: 1024px) {
        font-size: 28px;
        padding: 15px 0;
    }
    @media (max-width: 480px) {
        font-size: 24px;
    }
`;

export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* border-bottom: 1px solid #ddd; */
    padding-bottom: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }
`;

export const UserInfoContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const UserDetails = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction: column;
`;

export const Username = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

export const Name = styled.span`
    color: #333;
    font-weight: bold;
    font-size: 20px;
    padding-right: 10px;

    @media (max-width: 480px) {
        font-size: 18px;
    }
`;

export const LoginID = styled.span`
    color: #777;
    font-weight: normal;
    font-size: 16px;

    @media (max-width: 480px) {
        font-size: 14px;
    }
`;

export const EditButton = styled.button`
    font-size: 14px;
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    background-color: black;
    color: white;
    cursor: pointer;
    text-align: center;
    font-weight: bold;

    &:hover {
        background-color: #888;
    }
`;

export const SummaryContainer = styled.div`
    display: flex;
    gap: 10px;
    background-color: #ffffff;
    padding: 15px;
    border-radius: 8px;
    width: 50%;
    justify-content: space-around;

    @media (max-width: 1024px) {
        width: 50%;
    }
    @media (max-width: 768px) {
        width: 100%;
        padding: 10px;
    }
`;

export const SummaryItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 16px;
`;

export const SummaryValue = styled.span`
    font-weight: bold;
    font-size: 24px;
    margin-top: 10px;

    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

export const OrderStatusContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #ffffff;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-top: 20px;
    height: 150px;

    @media (max-width: 768px) {
        height: auto;
        flex-direction: column;
        gap: 15px;
        padding: 20px;
    }
`;

export const OrderStatusItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    font-size: 16px;

    span:first-child {
        font-weight: bold;
        color: #555;
    }

    span:last-child {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-top: 10px;
    }
`;

export const Arrow = styled.div`
    font-size: 46px;
    color: #ddd;
    display: flex;
    align-items: center;
    margin: 0 10px;

    @media (max-width: 768px) {
        transform: rotate(90deg);
        margin: 0;
    }
`;

export const TabsContainer = styled.div`
    font-size: 22px;
    padding-top: 20px;
    /* border-bottom: 1px solid #eee; */
`;

export const SectionTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;

    @media (max-width: 480px) {
        font-size: 16px;
    }
`;

export const SectionContainer = styled.div`
    margin-top: 10px;
    padding: 10px;
    background: #ffffff;
    border-radius: 8px;
    /* border: 1px solid #ddd; */
`;

export const OrderItem = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
        padding: 15px 0;
    }
`;

export const OrderDetails = styled.div`
    display: flex;
    align-items: center; // 수직 중앙 정렬
    gap: 15px;
    flex: 2;
`;

export const ProductImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    margin-right: 10px; // 이미지와 텍스트 사이 간격 조정
`;

export const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center; // 텍스트를 수직 중앙에 정렬
`;

export const ProductName = styled.span`
    font-weight: bold;
    font-size: 16px;
    width: 250px;
`;

export const ProductPrice = styled.div`
    display: flex;
    align-items: center; // 중앙 정렬 추가
    font-size: 14px;
    color: #888;
    min-width: 100px;
    justify-content: flex-end;
`;

export const OrderQuantity = styled.div`
    text-align: center;
    font-size: 14px;
    min-width: 200px;
`;

export const OrderDate = styled.div`
    flex: 2;
    text-align: center;
    font-size: 14px;
    color: #666;
    align-items: center; // 중앙 정렬 추가

    @media (max-width: 768px) {
        width: 100%;
        text-align: left;
        font-size: 12px;
    }
`;

export const OrderStatus = styled.div`
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: green;
    align-items: center; // 중앙 정렬 추가

    @media (max-width: 768px) {
        width: 100%;
        text-align: left;
    }
`;

export const ReviewButton = styled.div`
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: black;
    cursor: pointer;
    text-decoration: none;
    align-items: center; // 중앙 정렬 추가

    @media (max-width: 768px) {
        width: 100%;
        text-align: left;
    }
`;

export const CouponStatusUsed = styled.div`
    color: gray;
`;

export const CouponStatusUnused = styled.div`
    color: green;
`;

export const SummaryValueText = styled.span`
    font-weight: bold;
    font-size: 24px;
    margin-top: 5px;
`;

export const ItemInfo = styled.div`
    color: #333;
    margin-top: 5px;
`;

export const PointItemContainer = styled.div`
    display: flex;
    height: 60px;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;

    .pointAmount {
        flex: 1;
        font-weight: bold;
        font-size: 16px;
        margin-left: 10px;
    }

    .pointDescription {
        flex: 2;
        text-align: center;
        font-size: 14px;
        color: #777;
        margin-left: -50px;
    }

    .pointDate {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #666;
    }

    .pointStatus {
        flex: 1;
        text-align: right;
        font-size: 14px;
        cursor: pointer;
        margin-right: 100px;
    }

    .point-positive {
        color: green;
        font-weight: bold;
    }

    .point-negative {
        color: red;
        font-weight: bold;
    }
`;
