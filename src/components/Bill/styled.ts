import styled from 'styled-components';

const BillStyled = styled.div`


.billPage {
    max-width: 1200px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    padding: 40px 20px;
    font-family: Arial, sans-serif;
}
.headerTitle {
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
}

/* 메인 컨테이너 스타일 */
.mainContent {
    display: flex;
    gap: 20px;
}

/* 좌측 섹션 (배송지 정보) */
.leftSection {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.leftSection h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
    margin-bottom: 15px;
}

.leftSection .radio-group {
    display: flex;
    align-items: center;
    gap: 10px;
    gap: 10px;
    margin-bottom: 15px;
}

.leftSection .radio-group label {
    font-weight: bold;
    font-size: 16px;
    margin: 0;
}

.leftSection input[type="radio"] {
    margin-right: 5px;
}

.leftSection input[type="text"] {
    width: calc(100% - 16px);
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

/* 우측 섹션 (주문 내역) */
.rightSection {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.rightSection h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
}

.orderItem {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.itemImage {
    width: 80px;
    height: 80px;
    object-fit: cover;
    object-fit: cover;
    border-radius: 4px;
}

.orderSummary {
    margin-top: 30px;
    font-size: 18px;
}

.orderSummary p {
    margin: 8px 0;
    font-weight: bold;
}

/* 포인트 및 쿠폰 섹션 */
.pointsSection,
.couponSection {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.pointsSection h3,
.couponSection h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.inputNumber {
    width: calc(100% - 16px);
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.couponSection select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.buttonClass {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    color: #fff;
    background-color: black;
    background-color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 20px;
    transition: background-color 0.3s;
    margin-top: 20px;
}

.buttonClass:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.buttonClass:hover:not(:disabled) {
    background-color: #333;
}

/* 결제 관련 UI */
.wrapper {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

#payment-method,
#agreement {
    margin-bottom: 20px;
    min-height: 100px;
}

/* 전체적인 폰트 크기 */
.globalFontSize {
    font-size: 16px;
}


`;

export default BillStyled;