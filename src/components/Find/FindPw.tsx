import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const FindPw = () => {
    const [form] = Form.useForm();
    const [id, setId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [sentCode, setSentCode] = useState<string>('');
    const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [verified, setVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    // 이메일 인증코드 전송
    const sendVerificationCode = async () => {
        try {
            setLoading(true);
            // 사용자 정보 확인 - 이름 제거
            const checkResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/check-user`, {
                id,
                email
            });

            if (!checkResponse.data.result) {
                message.error('일치하는 사용자 정보가 없습니다.');
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/send-mail`, {
                email
            });

            if (response.data.result) {
                setIsCodeSent(true);
                setSentCode(response.data.code);
                message.success('인증코드가 이메일로 전송되었습니다.');
                
                if (timerInterval) clearInterval(timerInterval);
                
                let timeRemaining = 180;
                setTimeLeft(timeRemaining);
                
                const timer = setInterval(() => {
                    timeRemaining -= 1;
                    setTimeLeft(timeRemaining);
                    
                    if (timeRemaining === 0) {
                        clearInterval(timer);
                        setIsCodeSent(false);
                        setSentCode('');
                        message.warning('인증 시간이 만료되었습니다.');
                    }
                }, 1000);
                
                setTimerInterval(timer);
            }
        } catch (error) {
            console.error('인증코드 전송 실패:', error);
            message.error('인증코드 전송에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };
    // 인증코드 확인
    const verifyCode = () => {
        if (verificationCode === sentCode) {
            setVerified(true);
            message.success('이메일이 인증되었습니다.');
            if (timerInterval) {
                clearInterval(timerInterval);
                setTimerInterval(null);
            }
        } else {
            message.error('잘못된 인증코드입니다.');
        }
    };

     // 비밀번호 재설정
     const handleResetPassword = async () => {
        if (!verified) {
            message.error('이메일 인증이 필요합니다.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
                id,
                email
            });

            if (response.data.result) {
                message.success('임시 비밀번호가 이메일로 전송되었습니다.');
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
        <Form form={form} onFinish={handleResetPassword} style={{ maxWidth: 400 }}>
            <h2>비밀번호 찾기</h2>
            
            <Form.Item 
                label="아이디" 
                required
                rules={[{ required: true, message: '아이디를 입력해주세요' }]}
            >
                <Input 
                    value={id} 
                    onChange={(e) => setId(e.target.value)} 
                    disabled={verified}
                />
            </Form.Item>
            
            <Form.Item 
                label="이메일" 
                required
                rules={[
                    { required: true, message: '이메일을 입력해주세요' },
                    { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
                ]}
            >
                <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={verified}
                />
            </Form.Item>

            {!verified && (
                <Form.Item>
                    <Button 
                        onClick={sendVerificationCode} 
                        disabled={!id || !email || isCodeSent}
                        loading={loading}
                    >
                        인증코드 전송
                    </Button>
                    {isCodeSent && (
                        <span style={{ marginLeft: 10, color: '#ff4d4f' }}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    )}
                </Form.Item>
            )}
  

            {isCodeSent && !verified && (
                <Form.Item label="인증코드" required>
                    <Input.Group compact>
                        <Input
                            style={{ width: 'calc(100% - 88px)' }}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                        />
                        <Button onClick={verifyCode}>확인</Button>
                    </Input.Group>
                </Form.Item>
            )}

            {verified && (
                <div style={{ marginBottom: 24, color: '#52c41a' }}>
                    ✓ 이메일이 인증되었습니다.
                </div>
            )}

            <Form.Item>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    disabled={!verified}
                    loading={loading}
                >
                    임시 비밀번호 발급
                </Button>
            </Form.Item>

            <p>
                아이디를 잊으셨나요? <a href="../../mall/findid">아이디 찾기</a>
            </p>
        </Form>
    );
};

export default FindPw;