import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';
import style from './profile.module.css';
import { Button, Form, Input, Modal, Space } from 'antd';
import DaumPostcode from 'react-daum-postcode';

interface PointItem {
    Amount: number;
    ChargeDate: string;
}
interface Coupon {
    CouponName: string;
    StartDate: string;
    ExpirationDate: string;
}

interface CouponItem {
    Coupon: Coupon;
    isUsed: boolean;
}
interface Product {
    ProductID: number;
    ProductName: string;
}

interface OrderItem {
    OrderID: number;
    Product: {
        ProductID: number;
        ProductName: string;
    };
    Quantity: number; // 수량 추가
    Amount: number;
    OrderDate: string;
    OrderStatus: 'Pending' | 'Completed' | 'Cancelled';
    hasReview: boolean;
}

const Profile = () => {
    const [form] = Form.useForm();
    const [name, setName] = useState<string>('');
    const [point, setPoint] = useState<string>('');
    const [pointList, setPointList] = useState<PointItem[]>([]);
    const [couponList, setCouponList] = useState<CouponItem[]>([]);
    const [orderList, setOrderList] = useState<OrderItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            let userId;
            try {
                const decoded: any = jwtDecode(token);
                userId = decoded.UserID;
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/name`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setName(response.data.name);
                setPoint(response.data.point);
                setPhone(response.data.phone);
                setAddress(response.data.address);

                form.setFieldsValue({
                    phone: response.data.phone,
                    residence: response.data.address,
                });
            } catch (error) {
                console.error('프로필 정보를 가져오는데 실패했습니다:', error);
                return;
            }

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orderlist`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setOrderList(response.data.data);
            } catch (error) {
                console.error('구매내역을 가져오는데 실패했습니다:', error);
            }

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/chargelist`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.result && response.data.data) {
                    setPointList(response.data.data);
                }
            } catch (error) {
                console.error('포인트 내역을 가져오는데 실패했습니다:', error);
            }

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/couponlist`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.result && response.data.data) {
                    setCouponList(response.data.data);
                }
            } catch (error) {
                console.error('쿠폰 목록을 가져오는데 실패했습니다:', error);
            }
        };

        fetchProfileData();
    }, [form]);

    const handleComplete = (data: any) => {
        const fullAddress = data.address;
        setAddress(fullAddress);
        form.setFieldsValue({
            residence: fullAddress,
        });
        setIsModalOpen(false);
        console.log('Selected address:', fullAddress); // 디버깅용
    };
    const handleUpdateProfile = async (values: any) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded.UserID;

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/updateProfile`,
                {
                    userId,
                    phone: values.phone,
                    address: values.residence,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert('회원정보가 수정되었습니다.');
                window.location.reload(); // 페이지 리로드
            }
        } catch (error) {
            console.error('회원정보 수정 실패:', error);
            alert('회원정보 수정에 실패했습니다.');
        }
    };
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const decoded: any = jwtDecode(token);
                const userId = decoded.UserID;

                // 회원정보 가져오기
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/userinfo`, // 새로운 엔드포인트
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.result) {
                    setPhone(response.data.data.PhoneNumber);
                    setAddress(response.data.data.Address);
                    form.setFieldsValue({
                        phone: response.data.data.PhoneNumber,
                        residence: response.data.data.Address,
                    });
                }
            } catch (error) {
                console.error('회원정보를 가져오는데 실패했습니다:', error);
            }
        };

        fetchUserInfo();
    }, [form]);
    const handleReviewClick = (orderId: number, productId: number) => {
        Router.push(`./review/write?orderId=${orderId}&productId=${productId}`);
    };

    const StatusText = (status: string) => {
        switch (status) {
            case 'Pending':
                return <span className={style.statusPending}>배송중</span>;
            case 'Completed':
                return <span className={style.statusCompleted}>배송완료</span>;
            case 'Cancelled':
                return <span className={style.statusCancelled}>주문 취소</span>;
            default:
                return '알 수 없음';
        }
    };

    return (
        <div className={style.profileContainer}>
            <div className={style.header}>
                <Image src="/pr.png" alt="Profile Image" width={50} height={50} />
                <div className={style.username}>{name}님</div>
            </div>

            <div className={style.sectionTitle}>구매내역</div>
            <div className={style.sectionContainer}>
                {orderList && orderList.length > 0 ? (
                    orderList.map((item, index) => (
                        <div key={index} className={style.orderItem}>
                            <div className={style.itemTitle}>{item.Product.ProductName}</div>
                            <div className={style.itemInfo}>주문일자: {item.OrderDate}</div>
                            <div className={style.itemInfo}>수량: {item.Quantity}개</div>
                            <div className={style.itemInfo}>총 금액: {item.Amount}원</div>
                            <div className={style.itemInfo}>주문상태: {StatusText(item.OrderStatus)}</div>
                            {item.OrderStatus === 'Completed' && !item.hasReview && (
                                <div
                                    className={style.reviewButton}
                                    onClick={() => handleReviewClick(item.OrderID, item.Product.ProductID)}
                                >
                                    리뷰 작성하기
                                </div>
                            )}
                            {item.OrderStatus === 'Completed' && item.hasReview && (
                                <div className={style.reviewButton} style={{ color: 'gray' }}>
                                    리뷰 작성 완료
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>구매 내역이 없습니다.</div>
                )}
            </div>

            <div className={style.sectionTitle}>포인트 내역</div>
            <div className={style.sectionContainer}>
                {pointList && pointList.length > 0 ? (
                    pointList.map((item, index) => (
                        <div key={index} className={style.pointItem}>
                            <div className={style.itemInfo}>
                                포인트: {item.Amount}
                                <span
                                    style={{
                                        color: item.Amount < 0 ? 'red' : 'blue',
                                        marginLeft: '10px',
                                    }}
                                >
                                    ({item.Amount < 0 ? '사용' : '적립'})
                                </span>
                            </div>
                            <div className={style.itemInfo}>적립일자: {item.ChargeDate}</div>
                        </div>
                    ))
                ) : (
                    <div>포인트 내역이 없습니다.</div>
                )}
            </div>

            <div className={style.sectionTitle}>쿠폰 목록</div>
            <div className={style.sectionContainer}>
                {couponList && couponList.length > 0 ? (
                    couponList.map((item, index) => (
                        <div key={index} className={style.couponItem}>
                            <div className={style.itemTitle}>{item.Coupon.CouponName}</div>
                            <div className={style.itemInfo}>시작일자: {item.Coupon.StartDate}</div>
                            <div className={style.itemInfo}>만료일자: {item.Coupon.ExpirationDate}</div>
                            <div className={item.isUsed ? style.couponStatusUsed : style.couponStatusUnused}>
                                {item.isUsed ? '사용완료' : '미사용'}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>쿠폰이 없습니다.</div>
                )}
            </div>

            <div className={style.sectionTitle}>회원정보</div>
            <div className={style.sectionContainer}>
                {!isEditing ? (
                    <>
                        <div className={style.infoItem}>
                            <div>전화번호: {phone}</div>
                            <div>주소: {address}</div>
                        </div>
                        <Button onClick={() => setIsEditing(true)}>정보 수정</Button>
                    </>
                ) : (
                    <Form form={form} onFinish={handleUpdateProfile} layout="vertical">
                        <Form.Item
                            name="phone"
                            label="핸드폰 번호"
                            rules={[
                                { required: true, message: '핸드폰 번호를 입력해 주세요' },
                                { pattern: /^[0-9]{10,11}$/, message: '올바른 핸드폰 번호를 입력해 주세요' },
                            ]}
                        >
                            <Input maxLength={11} placeholder="숫자만 입력" />
                        </Form.Item>

                        <Form.Item
                            name="residence"
                            label="주소"
                            rules={[{ required: true, message: '주소를 입력해 주세요' }]}
                        >
                            <Space.Compact>
                                <Input
                                    readOnly
                                    style={{ width: 'calc(100% - 100px)' }}
                                    value={address} // value 속성 추가
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        form.setFieldsValue({ residence: e.target.value });
                                    }}
                                />
                                <Button onClick={() => setIsModalOpen(true)}>주소찾기</Button>
                            </Space.Compact>
                        </Form.Item>

                        <Space>
                            <Button type="primary" htmlType="submit">
                                저장
                            </Button>
                            <Button onClick={() => setIsEditing(false)}>취소</Button>
                        </Space>
                    </Form>
                )}
            </div>

            <Modal
                title="주소 검색"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
                destroyOnClose={true}
                footer={null} // 이 부분을 추가
            >
                <DaumPostcode onComplete={handleComplete} />
            </Modal>
        </div>
    );
};

export default Profile;
