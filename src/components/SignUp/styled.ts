// SignUp/styled.ts
import styled from 'styled-components';

const SignupStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 20px;

  .signup-container {
    max-width: 480px;
    width: 100%;
    padding: 40px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    background-color: #ffffff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  }

  .logo-container {
    margin-bottom: 30px;
    text-align: center;
    cursor: pointer;
  }

  .title {
    text-align: center;
    margin-bottom: 25px;
    font-size: 26px;
    color: #333;
    font-weight: bold;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #555;
  }

  .form-input {
    width: calc(100% - 110px); /* 버튼과 여백 고려한 너비 조정 */
    margin-top: 5px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: #1976d2;
      box-shadow: 0 0 6px rgba(25, 118, 210, 0.3);
    }
  }

  .duplicate-button {
    margin-left: 10px;
    padding: 0 10px;
    background-color: black;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #115293;
    }
  }

  .form-button {
    width: 100%;
    padding: 12px;
    background-color: black;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #115293;
    }

    &:active {
      background-color: #0d3c73;
    }
  }

  .centered-text {
    text-align: center;
    margin-top: 20px;
    color: #666;
    font-size: 14px;
  }

  .link {
    color: #1976d2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .error-text {
    text-align: center;
    color: red;
    margin-top: 10px;
    font-size: 14px;
  }

  .checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #555;
  }

  .terms-text {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
  }
`;

export default SignupStyled;