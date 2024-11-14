import styled from 'styled-components';

const SignupStyled = styled.div`
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    padding: 15px;
    background-color: #ffffff;

    .signup-container {
        max-width: 100%;
        width: calc(100% - 30px);
        padding: 20px;
        border-radius: 10px;
        /* border: 1px solid #e0e0e0; */
        background-color: #ffffff;
        /* box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); */

        @media (min-width: 480px) {
            width: 440px;
            padding: 30px;
        }

        @media (min-width: 768px) {
            width: 480px;
            padding: 40px;
        }
    }

    .logo-container {
        margin-bottom: 20px;
        text-align: center;
        cursor: pointer;

        img {
            max-width: 80%;
            height: auto;

            @media (min-width: 480px) {
                max-width: 250px;
            }

            @media (min-width: 768px) {
                max-width: 300px;
            }
        }
    }

    .title {
        text-align: center;
        margin-bottom: 20px;
        font-size: 22px;
        color: #333;
        font-weight: bold;

        @media (min-width: 768px) {
            font-size: 26px;
            margin-bottom: 25px;
        }
    }

    // Ant Design Form 스타일 오버라이드
    .ant-form {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        .ant-form-item {
            margin-bottom: 16px;

            @media (min-width: 768px) {
                margin-bottom: 24px;
            }
        }

        .ant-form-item-label {
            label {
                font-size: 14px;

                @media (min-width: 768px) {
                    font-size: 15px;
                }
            }
        }
    }

    .form-input {
        width: 100%;
        padding: 8px;
        font-size: 14px;

        @media (min-width: 480px) {
            padding: 8px 11px;
            font-size: 15px;
        }

        &.ant-input-password {
            width: 100%;
        }
    }

    // Space.Compact 내부의 input 너비 조정
    .ant-space-compact {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;

        @media (min-width: 480px) {
            flex-direction: row;
            gap: 0;

            .form-input {
                width: calc(100% - 90px);
            }
        }
    }

    .duplicate-button {
        width: 100%;
        margin: 0;
        padding: 8px 15px;
        background-color: black;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        height: auto;
        border-radius: 6px !important;

        @media (min-width: 480px) {
            width: 80px;
            margin-left: 10px;
        }

        &:hover {
            background-color: #888 !important;
            color: white !important;
        }
    }

    .form-button {
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

        @media (min-width: 768px) {
            padding: 12px;
            font-size: 16px;
        }

        &:hover {
            background-color: #888 !important;
        }
    }

    .error-text {
        text-align: left;
        color: #ff4d4f;
        font-size: 13px;
        margin-top: 5px;

        @media (min-width: 480px) {
            margin-left: 10px;
            margin-top: 0;
        }
    }

    // 체크박스 스타일
    .ant-checkbox-wrapper {
        font-size: 13px;

        @media (min-width: 768px) {
            font-size: 14px;
        }

        a {
            color: #1890ff;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    // 피드백 메시지
    .ant-form-item-explain {
        font-size: 13px;
        margin-top: 4px;

        @media (min-width: 768px) {
            font-size: 14px;
        }
    }
`;

export default SignupStyled;