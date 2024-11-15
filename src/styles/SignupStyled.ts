import styled from 'styled-components';
import { Form, Input, Button } from 'antd';

export const ProfileEditContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    margin-top: -80px;
`;

export const ProfileEditFormContainer = styled.div`
    background-color: #fff;
    border-radius: 10px;
    width: 100%;
    max-width: 900px; /* 최대 너비를 900px로 증가 */
    padding: 40px; /* 패딩 추가 */
    /* display: flex;
    flex-direction: column;
    align-items: center; */
`;

export const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
    font-size: 22px;
    color: #333;
    font-weight: 600;
`;

export const LogoContainer = styled.div`
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
`;

export const FormContainer = styled(Form)`
    width: 100%;
    max-width: 700px;
    padding: 40px;
    background-color: #fff;
    border-radius: 10px;
    /* box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); */
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FormItem = styled(Form.Item)`
    width: 100%;
    margin-bottom: 20px;

    .ant-form-item-label > label {
        font-weight: 600;
        font-size: 14px;
        color: #333;
    }

    .ant-form-item-control-input-content {
        display: flex;
        align-items: center;
    }
`;

// export const InputField = styled(Input)`
//     padding: 12px;
//     font-size: 16px;
//     border-radius: 5px;
//     border: 1px solid #ccc;
//     &:focus {
//         border-color: #333;
//     }
// `;

export const FormButton = styled(Button)`
    width: 50%;
    background-color: black;
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #888 !important;
    }
`;

export const CancelButton = styled(Button)`
    width: 50%;
    border: 2px solid black;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
        background-color: #888 !important;
        color: white !important;
        border: black !important;
    }
`;

export const InputField = styled(Input)`
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 15px;
    width: 100%;

    &:focus {
        border-color: #333;
    }
`;

export const AddressInput = styled(Input)`
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 15px;
    width: 100%;
    background-color: none;

    &:focus {
        border-color: #333;
    }
`;

export const DetailAddressInput = styled(Input)`
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 15px;
    width: 100%;

    &:focus {
        border-color: #333;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    margin-top: 15px;
`;

export const StyledButton = styled(Button)`
    background-color: black;
    color: white;
    border: none;
    border-radius: 6px;
    height: 40px;
    font-weight: bold;
    margin-left: 15px;
    &:hover {
        background-color: #888 !important;
        color: white !important; 
    }
`;

// 입력 필드와 버튼 사이의 경계선 및 패딩을 제거하기 위한 래퍼
export const AddressInputWrapper = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9; // 입력 필드의 테두리와 일치
    border-radius: 5px;
    padding: 0;
`;

export const AddressInputField = styled(Input)`
    border: none;
    box-shadow: none;
    &:focus,
    &:hover {
        border-color: transparent;
        box-shadow: none;
    }
`;