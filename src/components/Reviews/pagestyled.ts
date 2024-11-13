import styled from 'styled-components';

const PageStyled = styled.div`

.reviewContainer {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
    font-family: Arial, sans-serif;
  }
  
  .reviewGrid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .pageButton {
    margin: 0 5px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
    color: #555;
    background-color: #fff;
    transition: background-color 0.2s;
  }
  
  .pageButtonActive {
    background-color: #eee;
  }
  
  .sortContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 15px;
  }
  
  .sortSelect {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 14px;
    color: #333;
  }
  
  `;

export default PageStyled;