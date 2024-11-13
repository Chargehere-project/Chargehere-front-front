// SignUp/index.tsx
import React, { useState } from 'react';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Space,
} from 'antd';
import axios from 'axios';
import Router from 'next/router';
import Image from 'next/image';
import SignupStyled from './styled';

const SignUp = () => {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [checkId, setCheckId] = useState<string>('');
    const [isIdChecked, setIsIdChecked] = useState(false);

    const check = async () => {
        // 아이디 중복 확인 로직
    };

    const onFinish = async (values: any) => {
        // 회원가입 완료 로직
    };

    const handleIdChange = () => {
        setIsIdChecked(false);
    };

    return (
        <SignupStyled>
            <div className="signup-container">
                <div className="logo-container" onClick={() => Router.push('/mall')}>
                    <Image src="/main.png" alt="Main Logo" width={300} height={100} />
                </div>

                <h2 className="title">Signup</h2>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="id"
                        label="아이디 (이메일)"
                        rules={[
                            {
                                required: true,
                                message: '이메일을 입력해 주세요',
                            },
                            {
                                type: 'email',
                                message: '유효한 이메일 형식이어야 합니다',
                            },
                        ]}
                    >
                        <Space.Compact>
                            <Input className="form-input" onChange={handleIdChange} />
                            <Button onClick={check} className="duplicate-button" htmlType="button">
                                중복검사
                            </Button>
                            <div className="error-text">{errorMessage}</div>
                            <div style={{ color: 'green' }}>{checkId}</div>
                        </Space.Compact>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="비밀번호"
                        rules={[
                            {
                                required: true,
                                message: '비밀번호를 입력해 주세요',
                            },
                            {
                                min: 8,
                                message: '비밀번호는 최소 8자리 이상이어야 합니다',
                            },
                            {
                                max: 16,
                                message: '비밀번호는 16자리를 초과할 수 없습니다',
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                                message: '비밀번호는 영문 대/소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password className="form-input" placeholder="비밀번호를 입력해주세요" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="비밀번호 확인"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '비밀번호를 다시 입력해 주세요',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('비밀번호가 서로 다릅니다'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password className="form-input" />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="이름"
                        rules={[{ required: true, message: '이름을 작성해 주세요', whitespace: true }]}
                    >
                        <Input className="form-input" />
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('이용약관에 체크해 주세요')),
                            },
                        ]}
                    >
                        <Checkbox>
                            <a href="">이용약관</a>을 읽었으며 이에 동의합니다
                        </Checkbox>
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="form-button">
                            회원가입
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </SignupStyled>
    );
};

export default SignUp;
