import styled from 'styled-components';

const ButtonStyled = styled.div`


.scrollTopButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #333;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .qrButton {
    position: fixed;
    bottom: 80px; /* 위로 올리기 버튼 위에 배치 */
    right: 20px;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    }
  
    :where(.css-dev-only-do-not-override-49qm).ant-btn-variant-solid {
    background: black !important;
    }


    `;

export default ButtonStyled;