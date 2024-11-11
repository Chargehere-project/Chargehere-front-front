import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const FindPw = () => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // 이메일 인증코드 전송
    const sendVerificationCode = async () => {
        try {
            // 이름과 이메일을 서버로 보내 사용자 확인
            const checkUserResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/check-user`, {
                name,
                email,
            });

            if (!checkUserResponse.data.result) {
                message.error('사용자 정보를 찾을 수 없습니다.');
                return;
            }

            // 이메일로 인증코드 전송
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

    // 인증코드 확인
    const verifyCode = () => {
        if (verificationCode === sentCode) {
            setVerified(true);
            message.success('인증이 완료되었습니다.');
        } else {
            message.error('잘못된 인증코드입니다.');
        }
    };

    // 비밀번호 재설정
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
        <Form form={form} style={{ maxWidth: 400 }}>
            <h2>비밀번호 찾기</h2>

            <Form.Item
                label="이름"
                name="name"
                rules={[{ required: true, message: '이름을 입력해주세요.' }]}
            >
                <Input value={name} onChange={(e) => setName(e.target.value)} disabled={verified} />
            </Form.Item>

            <Form.Item
                label="이메일"
                name="email"
                rules={[
                    { required: true, message: '이메일을 입력해주세요.' },
                    { type: 'email', message: '올바른 이메일 형식이 아닙니다.' },
                ]}
            >
                <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={verified} />
            </Form.Item>

            {!verified && (
                <Form.Item>
                    <Button onClick={sendVerificationCode} disabled={!name || !email || isCodeSent}>
                        인증코드 전송
                    </Button>
                </Form.Item>
            )}

            {isCodeSent && !verified && (
                <Form.Item label="인증코드">
                    <Input
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                    />
                    <Button onClick={verifyCode}>확인</Button>
                </Form.Item>
            )}

            {verified && (
                <>
                    <Form.Item
                        label="새 비밀번호"
                        name="newPassword"
                        rules={[
                            { required: true, message: '비밀번호를 입력해주세요.' },
                            { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: '대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
                            },
                        ]}
                    >
                        <Input.Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="새 비밀번호를 입력해주세요"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={resetPassword} loading={loading} disabled={!newPassword}>
                            비밀번호 재설정
                        </Button>
                    </Form.Item>
                </>
            )}

            <p>
                아이디를 잊으셨나요? <a href="/mall/findid">아이디 찾기</a>
            </p>
        </Form>
    );
};

export default FindPw;