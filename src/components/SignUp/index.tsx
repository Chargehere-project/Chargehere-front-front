import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Modal, Select, InputNumber, Divider } from 'antd';
import DaumPostcode from 'react-daum-postcode';
import axios from 'axios';
import './BillPage.css';

const { Option } = Select;

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Coupon {
  couponId: string;
  couponName: string;
  discountAmount: number;
}

const BillPage = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userData, setUserData] = useState({ name: '', phone: '', address: '' });
    const [recipientData, setRecipientData] = useState({ name: '', phone: '', address: '', detailAddress: '' });
    const [useSameInfo, setUseSameInfo] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [points, setPoints] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [orderListId, setOrderListId] = useState<string | null>(null);

    // userId와 orderListId를 먼저 가져오는 함수
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userIdResponse = await axios.get('/api/getUserId'); // userId를 가져오는 API
                const orderListIdResponse = await axios.get('/api/getOrderListId'); // orderListId를 가져오는 API

                setUserId(userIdResponse.data.userId);
                setOrderListId(orderListIdResponse.data.orderListId);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    // userId와 orderListId로 데이터를 가져오는 함수
    useEffect(() => {
        if (userId && orderListId) {
            const fetchData = async () => {
                try {
                    // 사용자 정보 가져오기
                    const userResponse = await axios.get('/api/userInfo', { params: { userId } });
                    setUserData(userResponse.data);
                    form.setFieldsValue({
                        ordererName: userResponse.data.name,
                        ordererPhone: userResponse.data.phone,
                        ordererAddress: userResponse.data.address,
                    });

                    // 주문 아이템 목록 가져오기
                    const orderResponse = await axios.get('/api/orderItems', { params: { orderListId } });
                    setOrderItems(orderResponse.data.items);
                    setTotalAmount(orderResponse.data.totalAmount);

                    // 사용 가능한 쿠폰 목록 가져오기
                    const couponResponse = await axios.get('/api/coupons', { params: { userId } });
                    setAvailableCoupons(couponResponse.data);

                    // 사용 가능한 포인트 가져오기
                    const pointsResponse = await axios.get('/api/points', { params: { userId } });
                    setPoints(pointsResponse.data.points);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [form, userId, orderListId]);

    // 주소 검색 완료 시
    const handleComplete = (data: any) => {
        const fullAddress = data.address;
        form.setFieldsValue({ recipientAddress: fullAddress });
        setRecipientData((prev) => ({ ...prev, address: fullAddress }));
        setIsModalVisible(false);
    };

    // 주문자 정보와 동일 체크
    const handleUseSameInfoChange = (e: any) => {
        const isSame = e.target.value;
        setUseSameInfo(isSame);
        if (isSame) {
            form.setFieldsValue({
                recipientName: userData.name,
                recipientPhone: userData.phone,
                recipientAddress: userData.address,
            });
            setRecipientData({
                name: userData.name,
                phone: userData.phone,
                address: userData.address,
                detailAddress: '',
            });
        } else {
            form.resetFields(['recipientName', 'recipientPhone', 'recipientAddress', 'detailAddress']);
        }
    };

    const handleUsePoints = (value: number | null) => {
        if (value !== null) {
            setPointsToUse(value);
            calculatePaymentAmount(selectedCoupon ? selectedCoupon.discountAmount : 0, value);
        }
    };

    const handleCouponSelection = (couponId: string) => {
        const coupon = availableCoupons.find((c) => c.couponId === couponId) || null;
        setSelectedCoupon(coupon);
        calculatePaymentAmount(coupon ? coupon.discountAmount : 0, pointsToUse);
    };

    const calculatePaymentAmount = (discountAmount: number, pointsUsed: number) => {
        const discountedTotal = totalAmount - discountAmount - pointsUsed;
        setDiscount(discountAmount + pointsUsed);
        setPaymentAmount(discountedTotal > 0 ? discountedTotal : 0);
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
                label="아이디"
                rules={[
                    {
                        required: true,
                        message: '이메일을 입력해 주세요',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            {errorMessage && <div style={{ color: 'red', marginBottom: '16px' }}>{errorMessage}</div>}
            <Form.Item
                name="password"
                label="비밀번호"
                rules={[
                    {
                        required: true,
                        message: '비밀번호를 입력해 주세요',
                    },
                ]}
                hasFeedback
            >
                <Input.Password />
            </Form.Item>
            <Form.Item label="이름" name="recipientName" rules={[{ required: true, message: '이름을 입력해 주세요' }]}>
                <Input disabled={useSameInfo} />
            </Form.Item>
            <Form.Item label="전화번호" name="recipientPhone" rules={[{ required: true, message: '전화번호를 입력해 주세요' }]}>
                <Input disabled={useSameInfo} />
            </Form.Item>
            <Form.Item label="생년월일" required>
  <Input.Group compact>
    <Form.Item
      name="birthYear"
      noStyle
      rules={[{ required: true, message: '년도를 입력해 주세요' }]}
    >
      <Input style={{ width: '30%' }} placeholder="YYYY" />
    </Form.Item>
    <Form.Item
      name="birthMonth"
      noStyle
      rules={[{ required: true, message: '월을 입력해 주세요' }]}
    >
      <Input style={{ width: '25%', margin: '0 5px' }} placeholder="MM" />
    </Form.Item>
    <Form.Item
      name="birthDay"
      noStyle
      rules={[{ required: true, message: '일을 입력해 주세요' }]}
    >
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
            <Form.Item
  name="residence"
  label="주소"
  rules={[{ required: true, message: '주소를 입력해 주세요' }]}
>
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
<Form.Item
  name="detailAddress"
  label="상세 주소"
>
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
            <Form.Item label="사용할 포인트">
                <InputNumber
                    min={0}
                    max={points}
                    value={pointsToUse}
                    onChange={handleUsePoints}
                    placeholder="포인트 입력"
                />
            </Form.Item>
            <Divider />

            <div className="summary">
                <h3>결제 정보</h3>
                <div className="summary-details">
                    <p>총 주문 금액: <span>₩{totalAmount}</span></p>
                    <p>총 할인액: <span>₩{discount}</span></p>
                    <p>총 결제 예정 금액: <span>₩{paymentAmount}</span></p>
                </div>
            </div>
            <Divider />

            <Button type="primary" htmlType="submit" style={{ width: '100%', height: '50px', fontSize: '18px' }}>
                결제하기
            </Button>

            <Modal
                title="주소 검색"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <DaumPostcode onComplete={handleComplete} />
            </Modal>
        </Form>
    );
};
export default SignUp;