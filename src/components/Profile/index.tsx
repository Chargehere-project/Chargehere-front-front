import axios from 'axios';
import React from 'react';
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';
import { Button, Form, Input, Modal, Space, Tabs } from 'antd';
import DaumPostcode from 'react-daum-postcode';

import {
    ProfileContainer,
    Title,
    InfoRow,
    UserInfoContainer,
    UserDetails,
    Username,
    Name,
    LoginID,
    EditButton,
    SummaryContainer,
    SummaryItem,
    SummaryValue,
    OrderStatusContainer,
    OrderStatusItem,
    Arrow,
    TabsContainer,
    SectionTitle,
    SectionContainer,
    OrderItem,
    OrderDetails,
    ProductImage,
    ProductName,
    ProductPrice,
    OrderQuantity,
    OrderDate,
    OrderStatus,
    ReviewButton,
    PointItemContainer,
    CouponItemContainer,
} from './StyledProfile';

const { TabPane } = Tabs;

const formatDate = (dateString: string) => {
    if (!dateString) return '날짜 없음'; // dateString이 없을 경우 기본값 반환

    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
};

interface PointItem {
    Description: ReactNode;
    Amount: number;
    createdAt: string;
}
interface Coupon {
    CouponName: string;
    StartDate: string;
    ExpirationDate: string;
}

interface CouponItem {
    IsUsed: boolean;
    Coupon: Coupon;
    isUsed: boolean;
}
interface Product {
    ProductID: number;
    ProductName: string;
    ProductImage: string;
    Image: string;
    Price: number;
}

interface OrderItem {
    OrderList: any;
    OrderID: number;
    Product: Product;
    Quantity: number;
    Amount: number;
    OrderDate: string;
    OrderStatus: 'Pending' | 'Completed' | 'Cancelled' | 'DeliveryCompleted' | 'Shipping';
    hasReview: boolean;
    TransactionStatus: 'Pending' | 'Completed';
    OrderListID: number;
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
    const [loginID, setLoginID] = useState<string>('');
    const [couponCount, setCouponCount] = useState<number>(0);
    const [reviewCount, setReviewCount] = useState<number>(0);
    const [orderSummary, setOrderSummary] = useState({
        completed: 0, // 결제 완료
        shipping: 0, // 배송 중
        DeliveryCompleted: 0, // 배송 완료
    });

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

                // 서버 응답 데이터 구조 확인
                console.log('서버 응답 전체:', response.data);
                console.log('주문 데이터 첫번째 항목:', response.data.data[0]);

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

                console.log('포인트 내역 응답 데이터:', response.data.data);

                if (response.data.result && response.data.data) {
                    setPointList(response.data.data);
                    console.log('포인트 내역', response.data.data);
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
                    setCouponCount(response.data.data.length);
                }
            } catch (error) {
                console.error('쿠폰 목록을 가져오는데 실패했습니다:', error);
            }
        };

        fetchProfileData();
    }, [form]);

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

                // 응답 데이터 콘솔에 출력하여 확인
                console.log('Order List Response:', response.data);
                setOrderList(response.data.data);
                const reviewableOrders = response.data.data.filter(
                    (order: { OrderStatus: string; hasReview: any }) =>
                        order.OrderStatus === 'DeliveryCompleted' && !order.hasReview
                );
                setReviewCount(reviewableOrders.length);
            } catch (error) {
                console.error('구매내역을 가져오는데 실패했습니다:', error);
            }
        };

        fetchProfileData();
    }, [form]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            let userId;
            try {
                const decoded: any = jwtDecode(token);
                userId = decoded.UserID;

                // 기본 프로필 데이터 가져오기
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
                setLoginID(response.data.loginID);
                setPoint(response.data.point);
                setPhone(response.data.phone);
                setAddress(response.data.address);

                // 주문 요약 데이터 가져오기
                const summaryResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/order-summary`,
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // 주문 요약 상태 설정
                if (summaryResponse.data.result) {
                    setOrderSummary(summaryResponse.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

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

    const handleReviewClick = (orderListId: number, productId: number) => {
        // 디버깅용 로그 추가
        console.log('리뷰 클릭 데이터:', {
            orderListId,
            productId,
            전체주문: orderList, // 현재 상태의 전체 데이터 확인
        });

        if (orderListId && productId) {
            Router.push(`./review/write?orderListId=${orderListId}&productId=${productId}`);
        } else {
            console.error(`orderListId(${orderListId}) 또는 productId(${productId})가 없습니다`);
        }
    };

    // const StatusText = (status: string) => {
    //     switch (status) {
    //         case 'Pending':
    //             return <span className={style.statusPending}>배송중</span>;
    //         case 'Completed':
    //             return <span className={style.statusCompleted}>배송완료</span>;
    //         case 'Cancelled':
    //             return <span className={style.statusCancelled}>주문 취소</span>;
    //         default:
    //             return '알 수 없음';
    //     }
    // };

    const StatusText = (status: string, transactionStatus?: string) => {
        if (transactionStatus === 'Completed') {
            return <span style={{ color: 'green' }}>결제 완료</span>;
        } else {
            switch (status) {
                case 'Completed':
                    return <span style={{ color: 'orange' }}>결제 완료</span>;
                case 'Shipping':
                    return <span style={{ color: 'green' }}>배송 중</span>;
                case 'DeliveryCompleted':
                    return <span style={{ color: 'red' }}>배송완료</span>;
                default:
                    return status;
            }
        }
    };

    return (
        <ProfileContainer>
            <Title>MY PAGE</Title>
            <InfoRow>
                <UserInfoContainer>
                    <Image src="/pr.png" alt="Profile Image" width={100} height={100} />
                    <UserDetails>
                        <Username>
                            <Name>{name}</Name>
                            <LoginID>({loginID})</LoginID>
                        </Username>
                        <EditButton onClick={() => Router.push('/mall/profile/edit')}>회원정보 수정</EditButton>
                    </UserDetails>
                </UserInfoContainer>

                <SummaryContainer>
                    <SummaryItem>
                        <span>쿠폰</span>
                        <SummaryValue>{couponCount}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                        <span>포인트</span>
                        <SummaryValue>{point.toLocaleString()}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                        <span>작성가능 리뷰</span>
                        <SummaryValue>{reviewCount}</SummaryValue>
                    </SummaryItem>
                </SummaryContainer>
            </InfoRow>

            <OrderStatusContainer>
                <OrderStatusItem>
                    <span>결제 완료</span>
                    <span>{orderSummary.completed}</span> {/* completed로 변경 */}
                </OrderStatusItem>
                <Arrow>›</Arrow>
                <OrderStatusItem>
                    <span>배송 중</span>
                    <span>{orderSummary.shipping}</span> {/* shipping으로 변경 */}
                </OrderStatusItem>
                <Arrow>›</Arrow>
                <OrderStatusItem>
                    <span>배송 완료</span>
                    <span>{orderSummary.DeliveryCompleted}</span> {/* DeliveryCompleted로 변경 */}
                </OrderStatusItem>
            </OrderStatusContainer>

            <TabsContainer>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="구매 정보" key="1">
                        <SectionTitle></SectionTitle>
                        <SectionContainer>
                            {orderList.map((item, index) => (
                                <OrderItem key={index}>
                                    <OrderDetails>
                                        <ProductImage
                                            src={item.Product.Image}
                                            alt="Product Image"
                                            width={100}
                                            height={100}
                                        />

                                        <ProductName>{item.Product.ProductName}</ProductName>
                                        <ProductPrice>
                                            <span className="price">{item.Amount.toLocaleString()}</span>
                                            <span className="currency">원</span>
                                        </ProductPrice>
                                    </OrderDetails>
                                    <OrderQuantity>{item.Quantity || 1}개</OrderQuantity>
                                    <OrderDate>{new Date(item.OrderDate).toLocaleString()}</OrderDate>
                                    <OrderStatus>{StatusText(item.OrderStatus, item.TransactionStatus)}</OrderStatus>
                                    <ReviewButton>
                                        {item.OrderStatus === 'DeliveryCompleted' && !item.hasReview ? (
                                            <span
                                                onClick={() => {
                                                    console.log('리뷰 클릭 아이템:', item);
                                                    handleReviewClick(item.OrderListID, item.Product.ProductID); // OrderListID 사용
                                                }}
                                            >
                                                리뷰 작성
                                            </span>
                                        ) : item.OrderStatus === 'DeliveryCompleted' && item.hasReview ? (
                                            <span style={{ color: 'gray' }}>리뷰 작성 완료</span>
                                        ) : (
                                            <span style={{ color: 'gray' }}>-</span>
                                        )}
                                    </ReviewButton>
                                </OrderItem>
                            ))}
                        </SectionContainer>
                    </TabPane>

                    <TabPane tab="포인트 정보" key="2">
                        <SectionContainer>
                            {pointList.length > 0 ? (
                                pointList.map((item, index) => {
                                    console.log('Raw CreatedAt Date:', item.createdAt); // 이 부분 추가
                                    console.log('Formatted Date:', formatDate(item.createdAt)); // 이 부분 추가
                                    return (
                                        <PointItemContainer key={index}>
                                            <div className="pointAmount">{item.Amount.toLocaleString()} 포인트</div>
                                            <div className="pointDescription">{item.Description}</div>
                                            <div className="pointDate">{formatDate(item.createdAt)}</div>
                                            <div
                                                className={`pointStatus ${
                                                    item.Amount > 0 ? 'point-positive' : 'point-negative'
                                                }`}
                                            >
                                                {item.Amount > 0 ? '적립' : '차감'}
                                            </div>
                                        </PointItemContainer>
                                    );
                                })
                            ) : (
                                <div>포인트 내역이 없습니다.</div>
                            )}
                        </SectionContainer>
                    </TabPane>

                    <TabPane tab="쿠폰 정보" key="3">
                        <SectionContainer>
                            {couponList.length > 0 ? (
                                couponList.map((item, index) => (
                                    <CouponItemContainer key={index}>
                                        <div>
                                            <div>{item.Coupon.CouponName}</div>
                                            <div>시작일자:{formatDate(item.Coupon.StartDate)}</div>
                                            <div>만료일자: {formatDate(item.Coupon.ExpirationDate)}</div>
                                            <div className={item.IsUsed ? 'couponStatusUsed' : 'couponStatusUnused'}>
                                                {item.IsUsed ? '사용완료' : '미사용'}
                                            </div>
                                        </div>
                                    </CouponItemContainer>
                                ))
                            ) : (
                                <div>쿠폰이 없습니다.</div>
                            )}
                        </SectionContainer>
                    </TabPane>

                    <TabPane tab="1:1 문의" key="4">
                        <SectionContainer>
                            <p>1:1 문의는 개발 예정입니다.</p>
                        </SectionContainer>
                    </TabPane>

                    <TabPane tab="상품 문의" key="5">
                        <SectionContainer>
                            <p>상품 문의는 개발 예정입니다.</p>
                        </SectionContainer>
                    </TabPane>
                </Tabs>
            </TabsContainer>
        </ProfileContainer>
    );
};

export default Profile;
