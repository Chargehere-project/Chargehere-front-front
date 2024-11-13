import styled from 'styled-components';

const BillStyled = styled.div`
  .billPage {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }

  .headerTitle {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;

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

  .leftSection, .rightSection {
    flex: 1;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;

    @media (min-width: 768px) {
      padding: 20px;
    }
  }

  .leftSection h3, .rightSection h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;

    @media (min-width: 768px) {
      font-size: 24px;
    }
  }

  .orderItem {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 10px;
    margin-bottom: 15px;
    align-items: center;

    @media (min-width: 768px) {
      grid-template-columns: 80px 2fr 1fr 1fr;
    }
  }

  .itemImage {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;

    @media (min-width: 768px) {
      width: 80px;
      height: 80px;
    }
  }

  .pointsSection, .couponSection {
    margin: 15px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;

    @media (min-width: 768px) {
      margin: 20px 0;
      padding: 20px;
    }
  }

  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;

    @media (min-width: 768px) {
      padding: 10px;
      font-size: 16px;
    }
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;

    @media (min-width: 768px) {
      flex-direction: row;
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

  .wrapper {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;

    @media (min-width: 768px) {
      padding: 20px;
    }
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
    padding: 12px;
    font-size: 16px;
    color: #fff;
    background-color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 15px;

    @media (min-width: 768px) {
      padding: 15px;
      font-size: 18px;
      margin-top: 20px;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #333;
    }
  }
`;

export default BillStyled;