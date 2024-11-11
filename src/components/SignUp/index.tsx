import React, { useState } from 'react';
import type { CascaderProps } from 'antd';
import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Modal,
    Space,
} from 'antd';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
const { Option } = Select;
import DaumPostcode from 'react-daum-postcode';
interface DataNodeType {
    value: string;
    label: string;
    children?: DataNodeType[];
}
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};
const SignUp = () => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [checkId, setCheckId] = useState<string>('');
    const [isIdChecked, setIsIdChecked] = useState(false);
    const check = async () => {
        try {
            const userId = form.getFieldValue('id');
            if (!userId) {
                setErrorMessage('아이디를 입력해주세요');
                setIsIdChecked(false);
                return;
            }
    
            // 이메일 형식 검사
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(userId)) {
                setErrorMessage('올바른 이메일 형식이 아닙니다');
                setIsIdChecked(false);
                setCheckId('');
                return;
            }
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/checkid`, { userId });
            console.log('데이터확인', response.data);
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
            alert('아이디 중복검사를 해주세요.');
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
            console.log('성공:', response.data);
            setErrorMessage('');
            Router.push('/mall/login');
        } catch (err) {
            console.log('실패:', err);
            if (axios.isAxiosError(err) && err.response) {
                setErrorMessage(err.response.data.message || '회원가입에 실패했습니다.');
            } else {
                setErrorMessage('알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    // ID 입력 필드에 onChange 이벤트 추가
    const handleIdChange = () => {
        setIsIdChecked(false);  // ID 변경 시 중복검사 상태 초기화
    };

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);


    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
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
                    <Input style={{ width: 'calc(100% - 100px)' }}  onChange={handleIdChange}  />
                    <Button onClick={check} htmlType="button">
                        중복검사
                    </Button>
                    <div style={{ color: 'red' }}>{errorMessage}</div>
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
                extra={
                    <span style={{ color: '#888', fontSize: '12px' }}>
                        8~16자리 영문 대/소문자, 숫자, 특수문자(@$!%*?&) 각각 1개 이상 포함
                    </span>
                }
            >
                <Input.Password placeholder="비밀번호를 입력해주세요" />
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
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="name"
                label="이름"
                rules={[{ required: true, message: '이름을 작성해 주세요', whitespace: true }]}
            >
                <Input />
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
                {...tailFormItemLayout}
            >
                <Checkbox>
                    <a href="">이용약관</a>을 읽었으며 이에 동의합니다
                </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    회원가입
                </Button>
            </Form.Item>

            <p>
                이미 회원이신가요? <a href="/mall/login">로그인</a>
            </p>
        </Form>
    );
};
export default SignUp;
