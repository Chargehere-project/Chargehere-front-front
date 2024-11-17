import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';
import DaumPostcode from 'react-daum-postcode';
import {
    ProfileEditContainer,
    ProfileEditFormContainer,
    Title,
    LogoContainer,
    FormButton,
    CancelButton,
    InputField,
    AddressInput,
    DetailAddressInput,
    ButtonContainer,
    AddressInputWrapper,
    AddressInputField,
    StyledButton,
} from '../../../styles/SignupStyled'; // 스타일 임포트

const ProfileEditPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isPasswordChanged, setIsPasswordChanged] = useState(false); // 비밀번호 변경 여부
    const [isModalVisible, setIsModalVisible] = useState(false); // 우편번호 검색 모달
    const [address, setAddress] = useState(''); // 선택된 주소
    const [detailAddress, setDetailAddress] = useState(''); // 상세주소
    const [isAddressUpdated, setIsAddressUpdated] = useState(false); // 주소 업데이트 여부

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token); // jwtDecode 함수 호출
        const userId = decoded.UserID;

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { userId },
                });
                setUserInfo(response.data);
                console.log('mypage', response.data);

                // 데이터가 성공적으로 로드되면, 폼 필드에 값을 설정합니다.
                if (response.data && response.data.data) {
                    form.setFieldsValue({
                        name: response.data.data.Name, // 데이터에서 name을 가져옵니다
                        phone: response.data.data.PhoneNumber, // 전화번호
                        address: response.data.data.Address, // 주소
                        password: '', // 비밀번호는 '****'로 표시, 사용자가 입력한 비밀번호는 숨김 처리
                    });
                    setAddress(response.data.data.Address);
                }
            } catch (error) {
                console.error('회원정보 가져오기 오류:', error);
                alert('회원정보 가져오기 실패');
            }
        };

        fetchUserData();
    }, [form]);

    // 비밀번호 변경 시 비밀번호 확인 필드를 필수로 설정하는 함수
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsPasswordChanged(e.target.value !== ''); // 비밀번호가 비어있지 않으면 변경된 것으로 간주
    };

    const handleSubmit = async (values: any) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded.UserID;

        try {
            setLoading(true);

            // 최종 저장할 주소는 선택된 주소 + 상세주소
            const fullAddress = `${address} ${detailAddress}`;

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/user/updateprofile`,
                {
                    userId,
                    phone: values.phone,
                    address: fullAddress, // 주소는 상세주소 포함하여 저장
                    name: values.name,
                    password: values.password || undefined, // 비밀번호는 비어있으면 기존 비밀번호를 유지
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('수정이 완료되었습니다'); // 수정 완료 메시지
            Router.push('/mall/profile'); // 수정 완료 후 /mall/profile로 이동
        } catch (error) {
            console.error('회원정보 수정 중 오류:', error);
            alert('회원정보 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        Router.push('/mall/profile'); // 취소 버튼을 눌렀을 때 /mall/profile로 이동
    };

    // 우편번호 검색 모달을 열기 위한 함수
    const showPostcodeModal = () => {
        setIsModalVisible(true);
    };

    // 우편번호 선택 완료 후 처리 함수
    const onCompletePost = (data: any) => {
        setAddress(data.roadAddress); // 도로명 주소
        form.setFieldsValue({
            address: data.roadAddress, // 도로명 주소
        });
        setIsAddressUpdated(true); // 주소가 업데이트되었음을 표시
        setIsModalVisible(false);
    };

    // 상세 주소 변경 함수
    const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetailAddress(e.target.value);
    };

    if (!userInfo) {
        return <div>로딩 중...</div>;
    }

    return (
        <ProfileEditContainer>
            <ProfileEditFormContainer>
                {/* <LogoContainer onClick={() => Router.push('/mall')}>
                    <Image src="/main.png" alt="Main Logo" width={300} height={100} />
                </LogoContainer> */}
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item name="name" label="이름" initialValue={userInfo?.data?.Name}>
                        <InputField />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="비밀번호"
                        rules={[
                            {
                                message: '비밀번호를 입력하세요',
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
                        hasFeedback>
                        <InputField
                            placeholder="비밀번호를 변경하지 않으면 비워두세요"
                            onChange={handlePasswordChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="비밀번호 확인"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: isPasswordChanged,
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
                        ]}>
                        <InputField />
                    </Form.Item>
                    <Form.Item name="phone" label="전화번호" initialValue={userInfo?.data?.PhoneNumber}>
                        <InputField />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="주소"
                        initialValue={userInfo?.data?.Address}
                        rules={[{ required: false, message: '주소를 입력하세요' }]}>
                        <AddressInputWrapper>
                            <AddressInputField value={address} placeholder="주소를 입력하세요" />
                            <StyledButton onClick={showPostcodeModal}>주소 검색</StyledButton>
                        </AddressInputWrapper>
                    </Form.Item>
                    <Form.Item
                        name="detailAddress"
                        label="상세주소"
                        rules={[
                            {
                                required: isAddressUpdated, // 주소가 새로 업데이트 되었을 때만 상세주소를 필수로 설정
                                message: '상세주소를 입력하세요',
                            },
                        ]}>
                        <DetailAddressInput
                            value={detailAddress}
                            onChange={handleDetailAddressChange}
                            placeholder="상세주소를 입력하세요"
                        />
                    </Form.Item>
                    <ButtonContainer>
                        <FormButton type="primary" htmlType="submit" loading={loading}>
                            수정완료
                        </FormButton>
                        <CancelButton type="default" onClick={handleCancel}>
                            취소
                        </CancelButton>
                    </ButtonContainer>
                </Form>
            </ProfileEditFormContainer>

            {/* 우편번호 모달 */}
            <Modal
                title="우편번호 검색"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}>
                <DaumPostcode onComplete={onCompletePost} />
            </Modal>
        </ProfileEditContainer>
    );
};

export default ProfileEditPage;
