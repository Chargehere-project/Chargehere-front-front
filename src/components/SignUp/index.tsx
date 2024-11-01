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
        <Form form={form} name="orderForm" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2>주문 제품 정보</h2>
            <Divider />
            <div className="order-items">
                {orderItems.map((item) => (
                    <div key={item.productId} className="order-item">
                        <div className="order-item-info">
                            <img src={`/images/products/${item.productId}.jpg`} alt={item.productName} className="order-item-image" />
                            <div>
                                <p className="product-name">{item.productName}</p>
                                <p>수량: {item.quantity}</p>
                                <p>가격: ₩{item.price}</p>
                                <p>소계: ₩{item.subtotal}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Divider />

            <h3>배송지 약관 동의</h3>
            <Form.Item name="termsAgreement" valuePropName="checked">
                <Radio.Group>
                    <Radio value={true}>약관에 동의합니다.</Radio>
                </Radio.Group>
            </Form.Item>
            <Divider />

            <h3>배송지 정보</h3>
            <Form.Item>
                <Radio.Group onChange={handleUseSameInfoChange} value={useSameInfo}>
                    <Radio value={true}>주문자 정보와 동일</Radio>
                    <Radio value={false}>직접 입력</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="이름" name="recipientName" rules={[{ required: true, message: '이름을 입력해 주세요' }]}>
                <Input disabled={useSameInfo} />
            </Form.Item>
            <Form.Item label="전화번호" name="recipientPhone" rules={[{ required: true, message: '전화번호를 입력해 주세요' }]}>
                <Input disabled={useSameInfo} />
            </Form.Item>
            <Form.Item label="주소" name="recipientAddress" rules={[{ required: true, message: '주소를 입력해 주세요' }]}>
                <Input.Group compact>
                    <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        readOnly
                        value={recipientData.address}
                        onChange={(e) => setRecipientData((prev) => ({ ...prev, address: e.target.value }))}
                        disabled={useSameInfo}
                    />
                    <Button onClick={() => setIsModalVisible(true)} disabled={useSameInfo}>주소찾기</Button>
                </Input.Group>
            </Form.Item>
            <Form.Item label="상세 주소" name="detailAddress">
                <Input
                    placeholder="상세 주소를 입력하세요"
                    onChange={(e) => setRecipientData((prev) => ({ ...prev, detailAddress: e.target.value }))}
                    disabled={useSameInfo}
                />
            </Form.Item>
            <Divider />

            <h3>쿠폰 및 포인트 적용</h3>
            <Form.Item label="쿠폰 선택">
                <Select onChange={handleCouponSelection} placeholder="쿠폰을 선택하세요">
                    <Option value="">쿠폰 선택</Option>
                    {availableCoupons.map((coupon) => (
                        <Option key={coupon.couponId} value={coupon.couponId}>
                            {coupon.couponName} - ₩{coupon.discountAmount} 할인
                        </Option>
                    ))}
                </Select>
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

export default BillPage;
