import styled from 'styled-components';

const HeaderStyled = styled.div`
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: white;
    z-index: 1000;
    display: flex;
    justify-content: center;
  }

  .headerContent {
    width: 100%;
    max-width: 95%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logoContainer {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .navContainer {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .navItem {
    font-size: 16px;
    cursor: pointer;
    color: #333;
    font-weight: bold;
    transition: color 0.3s;
  }

  .navItem:hover {
    color: #007bff;
  }

  .iconContainer {
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: 24px;
    margin-left: 20px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .icon:hover {
    color: #007bff;
  }

  .cartIconContainer {
    position: relative;
  }

  .cartCount {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
  }

  .menuButton {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 5px;
    color: #333;
    transition: color 0.3s ease;
  }

  .menuButtonActive {
    animation: colorPulse 0.6s ease;
  }

  @media screen and (max-width: 768px) {
    .menuButton {
      display: block;
    }

    .navContainer {
      position: absolute;
      top: 70px;
      left: 0;
      width: 100%;
      flex-direction: column;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      display: none;
    }

    .navOpen {
      display: flex;
    }

    .navItem {
      padding: 20px 0;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
  }
`;

export default HeaderStyled;
