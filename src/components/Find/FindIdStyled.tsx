import styled from 'styled-components';

const Container = styled.div`
    max-width: 100%;
    width: calc(100% - 30px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    padding: 15px;
    background-color: #ffffff;
    margin-top: -100px;

    .logo-container {
        margin-bottom: 40px;
        text-align: center;
        cursor: pointer;
    }
`;

const FormWrapper = styled.div`
    width: 100%;
    max-width: 440px;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ddd;
`;

const title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
    font-size: 22px;
    color: #333;
`;

const FormItem = styled.div`
    margin-bottom: 16px;

    label {
        font-weight: normal; // 라벨 폰트 가중치를 일반으로 설정
    }
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ddd;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: #ffffff;
    border: none;
    border-radius: 50px;
    font-size: 15px;
    font-weight: bold;
    height: auto;
    margin-top: 10px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #333;
    }
`;

const SuccessText = styled.p`
    color: #52c41a;
    margin-top: 10px;
    text-align: center;
`;

const ErrorText = styled.p`
    color: #ff4d4f;
    margin-top: 10px;
    text-align: center;
`;

const FooterText = styled.p`
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #666;

    a {
        color: #1890ff;
        text-decoration: none;
        font-weight: bold;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export { Container, FormWrapper, title, FormItem, InputField, SubmitButton, SuccessText, ErrorText, FooterText };
