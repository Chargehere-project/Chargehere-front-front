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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [checkId, setCheckId] = useState<string>('');
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);
        try {
            const response = await axios.post('http://localhost:8000/signup', {
                id: values.id,
                password: values.password,
                name: values.name,
                residence: values.residence,
                phone: values.phone,
            });
            console.log('성공:', response.data);
            setErrorMessage(''); // 성공 시 에러 메시지 초기화
            Router.push('/');
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

            const response = await axios.post('http://localhost:8000/checkid', { userId });
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
        setIsModalVisible(false);
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
                label="아이디"
                rules={[
                    {
                        required: true,
                        message: '아이디를 입력해 주세요',
                    },
                ]}
            >
                <Input.Group compact>
                    <Input style={{ width: 'calc(100% - 100px)' }} />
                    <Button onClick={check} htmlType="button">
                        중복검사
                    </Button>
                </Input.Group>
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
                <Input.Group compact>
                    <Form.Item name="birthYear" noStyle rules={[{ required: true, message: '년도를 입력해 주세요' }]}>
                        <Input style={{ width: '30%' }} placeholder="YYYY" />
                    </Form.Item>
                    <Form.Item name="birthMonth" noStyle rules={[{ required: true, message: '월을 입력해 주세요' }]}>
                        <Input style={{ width: '25%', margin: '0 5px' }} placeholder="MM" />
                    </Form.Item>
                    <Form.Item name="birthDay" noStyle rules={[{ required: true, message: '일을 입력해 주세요' }]}>
                        <Input style={{ width: '25%' }} placeholder="DD" />
                    </Form.Item>
                </Input.Group>
            </Form.Item>
            <Form.Item
                name="phone"
                label="핸드폰 번호"
                rules={[{ required: true, message: '핸드폰 번호를 입력해 주세요' }]}
            >
                <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="residence" label="주소" rules={[{ required: true, message: '주소를 입력해 주세요' }]}>
                <Input.Group compact>
                    <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        readOnly
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            form.setFieldsValue({ residence: e.target.value });
                        }}
                    />
                    <Button onClick={() => setIsModalVisible(true)}>주소찾기</Button>
                </Input.Group>
            </Form.Item>
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
            <Modal
                title="주소 검색"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
            >
                <DaumPostcode onComplete={handleComplete} />
            </Modal>
        </Form>
    );
};
export default SignUp;