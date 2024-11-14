import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import {
    Container,
    FormWrapper,
    title,
    FormItem,
    InputField,
    SubmitButton,
    SuccessText,
    ErrorText,
    FooterText,
} from './FindIdStyled';

const FindId = () => {
    const router = useRouter(); // useRouter를 사용하여 router 선언

    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleFindId = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/findid`, { name, phone });
            if (response.data.data) {
                setResult(`아이디: ${response.data.data.LoginID}`);
                setErrorMessage('');
            } else {
                setResult('');
                setErrorMessage('일치하는 정보가 없습니다.');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('에러가 발생했습니다.');
        }
    };

    const handleLogoClick = () => {
        router.push('/mall'); // router 사용
    };

    return (
        <Container>
            <div className="logo-container" onClick={handleLogoClick}>
                <Image src="/main.png" alt="Main Logo" width={300} height={100} />
            </div>
            <FormWrapper onSubmitCapture={handleFindId}>
                <title>아이디 찾기</title>
                <FormItem>
                    <label>이름</label>
                    <InputField
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormItem>
                <FormItem>
                    <label>핸드폰 번호</label>
                    <InputField
                        placeholder="핸드폰 번호를 입력하세요"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormItem>
                <SubmitButton type="submit">아이디 찾기</SubmitButton>
                {result && <SuccessText>{result}</SuccessText>}
                {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
                <FooterText>
                    비밀번호를 잊으셨나요? <a href="../../mall/findpw">비밀번호 찾기</a>
                </FooterText>
            </FormWrapper>
        </Container>
    );
};

export default FindId;
