import styled from 'styled-components';

const CartStyled = styled.div`


.cartContainer {
    width: 90%;
    display: flex;
    justify-content: space-between;
    padding: 40px;
    margin: 0 auto;
}

.cartTitle {
    font-size: 36px;
    font-weight: bold;
    color: #555;
    padding: 20px 0;
}

.cartMain {
    display: flex;
    flex-direction: column;
    width: 70%;
}

.selectAllContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.selectAllLabel {
    font-size: 18px;
    color: #333;
}

.selectAllCheckbox {
    margin-right: 10px;
}

.deleteAllButton {
    font-size: 16px;
    color: red;
    background: none;
    border: none;
    cursor: pointer;
}

.cartItems {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cartItem {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
}

.itemCheckbox {
    margin-right: 10px;
}

.itemImageContainer {
    width: 80px;
    height: 80px;
    margin-right: 20px;
}

.itemImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin-left: 5px;
}

.itemDetails {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.itemName {
    font-size: 18px;
    font-weight: bold;
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    margin-left: 10px;
}

.itemPrice {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
    min-width: 100px; /* 필요한 너비로 설정 */
    text-align: left;
}

.itemPrice span {
    margin-left: auto; /* '원' 텍스트를 오른쪽으로 고정 */
    padding-left: 4px; /* 금액과 '원' 간격 조정 */
    min-width: 150px;
}

.itemQuantity {
    font-size: 16px;
}


.quantitySelector {
    font-size: 16px;
}

.deleteButton {
    color: red;
    cursor: pointer;
}

.summaryContainer {
    width: 280px;
    padding: 20px 15px; 
    border-radius: 10px; 
    /* background-color: #f9f9f9; */
    /* box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  */
    display: flex;
    flex-direction: column;
    gap: 10px; 
}

.summaryTitle {
    font-size: 20px; 
    font-weight: bold;
    color: #000; 
    margin-bottom: 15px;
    text-align: left;
}

.summaryRow {
    display: flex;
    justify-content: space-between;
    font-size: 16px; 
    color: #333;
    padding: 8px 0; 
    /* border-bottom: 1px solid #eaeaea;  */
}

.summaryTotal {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 18px;
    padding: 25px 0;
    border-top: 1px solid #ddd;
}

.orderButton {
    width: 100%;
    padding: 12px 0;
    font-size: 16px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 25px; 
    cursor: pointer;
    margin-top: 20px;
    font-weight: bold;
    text-align: center;
}

.orderButton:hover {
    background-color: #333;
}

/* 태블릿 (1024px 이하) */
@media screen and (max-width: 1024px) {
    .cartContainer {
        padding: 20px;
    }

    .cartMain {
        width: 65%;
    }

    .cartTitle {
        font-size: 30px;
    }

    .itemName {
        font-size: 16px;
    }

    .summaryContainer {
        width: 280px;
    }
}

/* 작은 태블릿 (768px 이하) */
@media screen and (max-width: 768px) {
    .cartContainer {
        flex-direction: column;
        padding: 15px;
        gap: 20px; /* 추가 - 카트와 주문내역 사이 간격 */
        padding-top: 0; /* 추가 */
    }

    .cartMain {
        width: 100%;
        margin-bottom: 0; /* 변경 */
        padding-top: 10px; /* 추가 */
    }

    .cartTitle {
        font-size: 28px;
        padding: 10px 0; /* 수정 - 패딩 축소 */
        margin: 0;
        margin-top: 0; /* 명시적으로 margin-top 제거 */
    }

    .itemDetails {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .summaryContainer {
        width: 100%;
        position: static;
        margin-left: 0; /* 추가 */
        margin-top: 0; /* 변경 */
        box-sizing: border-box; /* 추가 */
    }

    .selectAllLabel {
        font-size: 16px;
    }
    .deleteAllButton {
        padding: 10px;
    }
}

/* 모바일 (480px 이하) */
@media screen and (max-width: 480px) {
    .cartContainer {
        padding: 10px;
    }

    .cartTitle {
        font-size: 24px;
        padding: 15px 0;
    }

    .cartItem {
        padding: 15px 10px;
        position: relative; /* 추가 */
    }

    .itemCheckbox {
        position: absolute; /* 변경 */
        top: 15px;
        left: 10px;
    }

    .itemImageContainer {
        width: 80px; /* 변경 */
        height: 80px; /* 변경 */
        margin-left: 30px; /* 추가 - 체크박스 공간 확보 */
    }

    .itemImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .itemDetails {
        width: calc(100% - 120px); /* 변경 - 이미지 공간 제외한 너비 */
        flex-direction: row; /* 변경 - 가로 정렬 */
        justify-content: space-between; /* 변경 */
        align-items: center; /* 변경 */
        margin-left: 10px; /* 추가 */
    }

    .itemName {
        font-size: 14px; /* 변경 */
        flex: 1; /* 추가 - 남은 공간 차지 */
        margin-right: 10px; /* 추가 */
        word-break: break-word; /* 추가 - 긴 상품명 처리 */
    }

    .itemPrice {
        font-size: 14px; /* 변경 */
        white-space: nowrap; /* 추가 - 가격 줄바꿈 방지 */
        margin-right: 10px; /* 추가 */
    }

    .itemQuantity {
        font-size: 14px; /* 변경 */
        white-space: nowrap; /* 추가 */
    }

    .deleteButton {
        position: absolute; /* 변경 */
        top: 15px;
        right: 10px;
    }

    .cartItem {
        display: flex;
        align-items: center;
        padding: 15px 10px;
        position: relative;
        margin-bottom: 10px;
    }
    .summaryContainer {
        padding: 15px;
        margin-bottom: 20px; /* 추가 - 하단 여백 */
    }

    .summaryTitle {
        font-size: 18px; /* 크기 조정 */
        margin-bottom: 15px;
    }

    .summaryRow {
        font-size: 14px; /* 크기 조정 */
        padding: 5px 0; /* 추가 - 행간 간격 */
    }

    .summaryTotal {
        font-size: 16px; /* 크기 조정 */
        margin-top: 15px;
        padding-top: 15px; /* 추가 */
        border-top: 1px solid #eaeaea; /* 추가 - 구분선 */
    }

    .orderButton {
        margin-top: 15px;
        padding: 12px 0;
        font-size: 16px;
        width: 100%;
    }

    /* 컨테이너 전체에 하단 패딩 추가 */
    .cartContainer {
        padding-bottom: 30px;
    }
}

`;

export default CartStyled;