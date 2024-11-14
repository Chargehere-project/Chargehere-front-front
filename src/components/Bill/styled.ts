import styled from 'styled-components';

const BillStyled = styled.div`
    .billPage {
        width: 90%;
        margin: 0 auto;
        padding: 20px;
    }

    .headerTitle {
        font-size: 36px;
        font-weight: bold;
        color: #555;
        padding: 20px 0;

        @media (min-width: 768px) {
            font-size: 32px;
            margin-bottom: 30px;
        }
    }

    .mainContent {
        display: flex;
        flex-direction: column;
        gap: 20px;

        @media (min-width: 1024px) {
            flex-direction: row;
        }
    }

    .leftSection {
        flex-basis: 70%;
        padding: 25px;
        border-radius: 8px;
        background-color: #fff;

        @media (min-width: 768px) {
            padding: 30px;
        }
    }

    .rightSection {
        flex-basis: 30%;
        padding: 25px;
        border-radius: 8px;
        background-color: #fff;

        @media (min-width: 768px) {
            padding: 30px;
        }
    }

    .leftSection h3,
    .rightSection h3 {
        font-size: 20px;
        color: #333;
        margin-bottom: 15px;
        margin-top: 20px;

        @media (min-width: 768px) {
            font-size: 24px;
        }
    }

    .radio-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }

    input[type='text'],
    input[type='number'],
    select {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        @media (min-width: 768px) {
            padding: 12px;
            font-size: 16px;
        }
    }

    .pointsSection {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 15px 0;
        padding: 15px;
        border-radius: 8px;

        @media (min-width: 768px) {
            margin: 20px 0;
            padding: 20px;
        }

        .pointsAvailable {
            font-weight: bold;
        }

        .pointsInputWrapper {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        input[type='number'] {
            flex: 1;
        }

        button {
            padding: 10px 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 30px;
            border: none;
            background-color: black;
            color: white;
            font-weight: bold;
            transition: background-color 0.3s ease;

            &:hover {
                background-color: #888;
            }
        }
    }

    .couponSection {
        margin: 15px 0;
        padding: 15px;
        /* border: 1px solid #ddd; */
        border-radius: 8px;
        /* background-color: #f9f9f9; */

        @media (min-width: 768px) {
            margin: 20px 0;
            padding: 20px;
        }
    }

    .orderSummary {
        margin-top: 20px;
        font-size: 16px;
        border-top: 1px solid #ddd;
        padding-top: 15px;

        @media (min-width: 768px) {
            font-size: 18px;
            margin-top: 30px;
        }
    }

    .rightSection .orderSummary {
        margin-bottom: 20px;
    }

    .orderItem {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;

        .itemImage {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
        }

        .itemDetails {
            display: flex;
            flex-direction: column;
            flex: 1;

            .productName {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
            }

            .priceQuantity {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #333;
            }
        }
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
    }

    .summaryTotal {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-size: 18px;
        padding: 25px 0;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }

    .wrapper {
        margin-top: 20px;
        padding: 20px;
        /* border: 1px solid #ddd; */
        border-radius: 8px;
    }

    #payment-method,
    #agreement {
        margin-bottom: 15px;
        min-height: 100px;

        @media (min-width: 768px) {
            margin-bottom: 20px;
        }
    }

    .buttonClass {
        width: 100%;
        padding: 15px;
        font-size: 16px;
        color: #fff;
        background-color: black;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 15px;
        font-weight: bold;

        &:hover {
          background-color: #888 !important;
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            background-color: #333;
        }

        @media (min-width: 768px) {
            font-size: 18px;
            padding: 18px;
            margin-top: 20px;
        }
    }

    .orderItem {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 20px 0;

        .itemImage {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
        }

        .itemDetails {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            flex: 1;
            margin-left: 5px;
        }

        .productName {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            margin-top: 35px;
        }

        .productInfo {
            font-size: 14px;
            color: #666;

            p {
                margin: 0;
            }

            p:first-child {
                color: #999;
            }
        }
    }
`;

export default BillStyled;
