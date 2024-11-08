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
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
                id: values.id,
                password: values.password,
                name: values.name,
                residence: values.residence,
                phone: values.phone,
            });
            console.log('성공:', response.data);
            setErrorMessage(''); // 성공 시 에러 메시지 초기화
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
    const check = async () => {
        try {
            const userId = form.getFieldValue('id');
            if (!userId) {
                setErrorMessage('아이디를 입력해주세요');
                return;
            }
            console.log('검사할 ID:', userId); // 요청 전 확인용 로그

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/checkid`, { userId });
            console.log('데이터확인', response.data);
            if (response.data.result === true) {
                setCheckId(response.data.message);
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message);
                setCheckId('');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('서버 오류가 발생했습니다');
            }
            setCheckId('');
            console.error('아이디 중복 검사 실패:', error);
        }
    };

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';
        console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
        form.setFieldsValue({ residence: fullAddress });
        setAddress(fullAddress);
        setIsModalOpen(false);
    };
    const onWebsiteChange = (value: string) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
        }
    };
    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

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
                    <Input style={{ width: 'calc(100% - 100px)' }} />
                    <Button onClick={check} htmlType="button">
                        중복검사
                    </Button>
                    <div>{errorMessage}</div>
                    <div>{checkId}</div>
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
            <Form.Item label="생년월일" required>
    <Space.Compact>
        <Form.Item
            name="birthYear"
            noStyle
            rules={[
                { required: true, message: '년도를 입력해 주세요' },
                {
                    validator: (_, value) => {
                        const currentYear = new Date().getFullYear();
                        if (value >= 1900 && value <= currentYear) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(`년도는 1900년부터 ${currentYear}년까지 가능합니다`));
                    },
                },
            ]}
        >
            <Input style={{ width: '30%' }} placeholder="YYYY" maxLength={4} />
        </Form.Item>
        <Form.Item
            name="birthMonth"
            noStyle
            rules={[
                { required: true, message: '월을 입력해 주세요' },
                {
                    validator: (_, value) => {
                        if (value >= 1 && value <= 12) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('월은 1월부터 12월까지 입력 가능합니다'));
                    },
                },
            ]}
        >
            <Input style={{ width: '25%', margin: '0 5px' }} placeholder="MM" maxLength={2} />
        </Form.Item>
        <Form.Item
            name="birthDay"
            noStyle
            rules={[
                { required: true, message: '일을 입력해 주세요' },
                {
                    validator: (_, value) => {
                        const year = form.getFieldValue('birthYear');
                        const month = form.getFieldValue('birthMonth');
                        if (!year || !month) {
                            return Promise.reject(new Error('연도와 월을 먼저 입력해 주세요'));
                        }
                        const daysInMonth = new Date(year, month, 0).getDate();
                        if (value >= 1 && value <= daysInMonth) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error(`${month}월에는 1일부터 ${daysInMonth}일까지 입력 가능합니다`));
                    },
                },
            ]}
        >
            <Input style={{ width: '25%' }} placeholder="DD" maxLength={2} />
        </Form.Item>
    </Space.Compact>
</Form.Item>
            <Form.Item
                name="phone"
                label="핸드폰 번호"
                rules={[{ required: true, message: '핸드폰 번호를 입력해 주세요' }]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="residence" label="주소" rules={[{ required: true, message: '주소를 입력해 주세요' }]}>
                <Space.Compact>
                    <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        readOnly
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            form.setFieldsValue({ residence: e.target.value });
                        }}
                    />
                    <Button onClick={handleModalOpen}>주소찾기</Button>
                </Space.Compact>
            </Form.Item>

            <Modal
                title="주소 검색"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                destroyOnClose={true}
            >
                {
                    <DaumPostcode
                        onComplete={(data) => {
                            handleComplete(data);
                            handleModalClose();
                        }}
                    />
                }
            </Modal>
            <Form.Item name="detailAddress" label="상세 주소">
                <Input
                    placeholder="상세 주소를 입력하세요"
                    onChange={(e) => {
                        const fullAddress = `${address} ${e.target.value}`.trim();
                        form.setFieldsValue({ residence: fullAddress });
                    }}
                />
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
