import styled from 'styled-components';
import { Input, Button } from 'antd';

export const ProfileEditContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin: 0 auto;
    height: 120vh;
    /* background-color: #f8f9fa; */
`;

export const ProfileEditFormContainer = styled.div`
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    width: 100%;
    max-width: 600px;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
`;

export const Title = styled.h2`
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    color: #333;
`;

export const LogoContainer = styled.div`
    text-align: center;
    margin-bottom: 40px;
    cursor: pointer;
`;

export const FormButton = styled(Button)`
    width: 50%;
    background-color: #333;
    border: none;
    padding: 10px;
    color: #fff;
    font-size: 16px;

    &:hover {
        background-color: #444;
    }
`;

export const CancelButton = styled(Button)`
    width: 50%;
    background-color: #333;
    border: none;
    padding: 10px;
    color: #fff;
    font-size: 16px;

    &:hover {
        background-color: #444;
    }
`;

export const InputField = styled(Input)`
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 20px;

    &:focus {
        border-color: #333;
    }
`;

export const AddressInput = styled(Input)`
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 20px;

    &:focus {
        border-color: #333;
    }
`;

export const DetailAddressInput = styled(Input)`
    padding: 12px;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 20px;

    &:focus {
        border-color: #333;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
`;
