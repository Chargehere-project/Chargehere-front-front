import React, { useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
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

const FindPw = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const sendVerificationCode = async () => {
        try {
            const checkUserResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check-user`, {
                name,
                email,
            });

            if (!checkUserResponse.data.result) {
                message.error('사용자 정보를 찾을 수 없습니다.');
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/send-mail`, { email });
            if (response.data.result) {
                setIsCodeSent(true);
                setSentCode(response.data.code);
                message.success('인증코드가 이메일로 전송되었습니다.');
            }
        } catch (error) {
            console.error('인증코드 전송 실패:', error);
            message.error('인증코드 전송에 실패했습니다.');
        }
    };

    const verifyCode = () => {
        if (verificationCode === sentCode) {
            setVerified(true);
            message.success('인증이 완료되었습니다.');
        } else {
            message.error('잘못된 인증코드입니다.');
        }
    };

    const resetPassword = async () => {
        if (!newPassword) {
            message.error('새 비밀번호를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
                name,
                email,
                newPassword,
            });

            if (response.data.result) {
                message.success('비밀번호가 성공적으로 재설정되었습니다.');
                form.resetFields();
                setVerified(false);
                setIsCodeSent(false);
            }
        } catch (error) {
            console.error('비밀번호 재설정 실패:', error);
            message.error('비밀번호 재설정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="logo-container" onClick={() => router.push('/mall')}>
                <Image src="/main.png" alt="Main Logo" width={300} height={100} />
            </div>
            <FormWrapper>
                <title>비밀번호 찾기</title>
                <FormItem>
                    <label>이름</label>
                    <InputField
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={verified}
                    />
                </FormItem>
                <FormItem>
                    <label>이메일</label>
                    <InputField
                        placeholder="이메일을 입력하세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={verified}
                    />
                </FormItem>
                {!verified && (
                    <SubmitButton onClick={sendVerificationCode} disabled={!name || !email || isCodeSent}>
                        인증코드 전송
                    </SubmitButton>
                )}
                {isCodeSent && !verified && (
                    <FormItem>
                        <label>인증코드</label>
                        <InputField
                            placeholder="인증코드를 입력하세요"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                        />
                        <SubmitButton onClick={verifyCode}>확인</SubmitButton>
                    </FormItem>
                )}
                {verified && (
                    <>
                        <FormItem>
                            <label>새 비밀번호</label>
                            <InputField
                                type="password"
                                placeholder="새 비밀번호를 입력해주세요"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </FormItem>
                        <SubmitButton onClick={resetPassword} disabled={!newPassword}>
                            {loading ? <Spin /> : '비밀번호 재설정'}
                        </SubmitButton>
                    </>
                )}
                <FooterText>
                    아이디를 잊으셨나요? <a href="/mall/findid">아이디 찾기</a>
                </FooterText>
            </FormWrapper>
        </Container>
    );
};

export default FindPw;
