import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Space, Modal } from 'antd';
import axios from 'axios';
import Router from 'next/router';
import Image from 'next/image';
import SignupStyled from './styled';

const SignUp = () => {
    const [form] = Form.useForm();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [checkId, setCheckId] = useState<string>('');
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const check = async () => {
        try {
            const userId = form.getFieldValue('id');
            if (!userId) {
                Modal.warning({
                    title: '아이디 입력 필요',
                    content: '아이디를 입력해주세요',
                });
                setIsIdChecked(false);
                return;
            }

            // 이메일 형식 검사
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(userId)) {
                Modal.warning({
                    title: '잘못된 이메일 형식',
                    content: '올바른 이메일 형식이 아닙니다',
                });
                setIsIdChecked(false);
                setCheckId('');
                return;
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/checkid`, { userId });
            if (response.data.result === true) {
                setCheckId(response.data.message);
                setErrorMessage('');
                setIsIdChecked(true);
            } else {
                setErrorMessage(response.data.message);
                setCheckId('');
                setIsIdChecked(false);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('서버 오류가 발생했습니다');
            }
            setCheckId('');
            setIsIdChecked(false);
            console.error('아이디 중복 검사 실패:', error);
        }
    };

    const onFinish = async (values: any) => {
        if (!isIdChecked) {
            Modal.warning({
                title: '아이디 중복 검사 필요',
                content: '아이디 중복검사를 해주세요.',
            });
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
                id: values.id,
                password: values.password,
                name: values.name,
                residence: values.residence,
                phone: values.phone,
            });
            setErrorMessage('');

            Modal.success({
                title: '회원가입 완료',
                content: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
                onOk() {
                    Router.push('/mall/login');
                },
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setErrorMessage(err.response.data.message || '회원가입에 실패했습니다.');
            } else {
                setErrorMessage('알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    const handleIdChange = () => {
        setIsIdChecked(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <SignupStyled>
            <div className="signup-container">
                <div className="logo-container" onClick={() => Router.push('/mall')}>
                    <Image src="/main.png" alt="Main Logo" width={300} height={100} />
                </div>

                <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
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
                                message:
                                    '비밀번호는 영문 대/소문자, 숫자, 특수문자(@$!%*?&)를 각각 하나 이상 포함해야 합니다',
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
                            <a onClick={showModal}>이용약관</a>을 읽었으며 이에 동의합니다
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="form-button">
                            회원가입
                        </Button>
                    </Form.Item>
                </Form>

                <Modal title="이용약관" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <p>시행일자: 2021년 08월 14일</p>
                        <h3>제 1 조 목적</h3>
                        <p>
                            제1조 목적 <br />
                            이 약관은 한국학술연구원(이하"회사"라 한다)이 운영하는 iks.or.kr (이하"사이트"라 한다)에서
                            제공하는 문자메세지 전송 서비스(이하 "서비스"라 한다)의 이용조건 및 절차, 회사와 회원간의
                            권리, 의무, 기타 필요한 사항을 규정함을 목적으로 합니다.
                            <br />
                            제2조 약관의 효력 및 변경
                            <br />
                            1. 이 약관은 그 내용을 회사 사이트에 게시하여 이용회원에게 공지함으로써 효력을 발생합니다.
                            <br />
                            2. 회사는 관련법을 위배하지 않는 범위에서 이 약관을 정할 수 있으며 필요시 약관을 변경할 수
                            있습니다.
                            <br />
                            3. 회사가 약관을 변경할 경우에는 회사 사이트에 그 적용일자 7일 이전부터 적용일자 전일까지
                            공지하며, 제1항과 같은 방법으로 효력이 발생합니다.
                            <br />
                            4. 회원은 변경된 약관 사항에 동의하지 않으면 서비스 이용을 중단하고 언제든지 탈퇴할 수
                            있습니다. 약관의 효력발생일 이후의 계속적인 서비스 이용은 약관의 변경사항에 동의한 것으로
                            간주합니다. <br />
                            제3조 약관의 적용
                            <br />
                            1. 이 약관에서 정하지 않은 사항은 관계법규에 의하거나, 관계법규 등에도 정함이 없는 경우
                            일반적인 상관례에 따릅니다.
                        </p>
                    </div>
                    <Button onClick={handleOk} type="primary">
                        확인
                    </Button>
                </Modal>
            </div>
        </SignupStyled>
    );
};

export default SignUp;
