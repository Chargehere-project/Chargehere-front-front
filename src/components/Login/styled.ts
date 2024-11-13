import styled from 'styled-components';

const LoginStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  padding: 20px;

  .login-container {
    max-width: 450px;
    width: 100%;
    padding: 30px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .logo-container {
    margin-bottom: 40px;
    text-align: center;
    cursor: pointer;
  }

  .title {
    text-align: center;
    margin-bottom: 25px;
    font-size: 24px;
    color: #333;
    font-weight: 600;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #555;
  }

  .form-input {
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #0597f2;
      box-shadow: 0 0 5px rgba(5, 151, 242, 0.3);
    }
  }

  .form-button {
    width: 100%;
    padding: 12px;
    background-color: black;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #333;
    }

    &:active {
      background-color: #035a8d;
    }
  }

  .centered-text {
    text-align: center;
    margin-top: 15px;
    color: #666;
    font-size: 14px;
  }

  .link {
    color: #555;
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
`;

export default LoginStyled;
