import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';
import style from './profile.module.css';
import { Button, Form, Input, Modal, Space, Tabs } from 'antd';
import DaumPostcode from 'react-daum-postcode';

const { TabPane } = Tabs;

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
    ProductImage: string;
    Image: string;
    Price: number;
}

interface OrderItem {
    OrderID: number;
    Product: Product;
    Quantity: number;
    Amount: number;
    OrderDate: string;
    OrderStatus: 'Pending' | 'Completed' | 'Cancelled';
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
        pending: 0,
        inPreparation: 0,
        shipping: 0,
        completed: 0,
    });
    

    // useEffect(() => {
    //     const fetchProfileData = async () => {
    //         const token = localStorage.getItem('token');
    //         if (!token) return;

    //         let userId;
    //         try {
    //             const decoded: any = jwtDecode(token);
    //             userId = decoded.UserID;
    //             const response = await axios.post(
    //                 `${process.env.NEXT_PUBLIC_API_URL}/api/name`,
    //                 { userId },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );
    //             setName(response.data.name);
    //             setPoint(response.data.point);
    //             setPhone(response.data.phone);
    //             setAddress(response.data.address);

    //             form.setFieldsValue({
    //                 phone: response.data.phone,
    //                 residence: response.data.address,
    //             });
    //         } catch (error) {
    //             console.error('프로필 정보를 가져오는데 실패했습니다:', error);
    //             return;
    //         }

    //         try {
    //             const response = await axios.post(
    //                 `${process.env.NEXT_PUBLIC_API_URL}/api/orderlist`,
    //                 { userId },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );

    //             // 응답 데이터 콘솔에 출력하여 확인
    //             console.log('Order List Response:', response.data);
    //             setOrderList(response.data.data);
    //         } catch (error) {
    //             console.error('구매내역을 가져오는데 실패했습니다:', error);
    //         }

    //         try {
    //             const response = await axios.post(
    //                 `${process.env.NEXT_PUBLIC_API_URL}/api/chargelist`,
    //                 { userId },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );

    //             if (response.data.result && response.data.data) {
    //                 setPointList(response.data.data);
    //             }
    //         } catch (error) {
    //             console.error('포인트 내역을 가져오는데 실패했습니다:', error);
    //         }

    //         try {
    //             const response = await axios.post(
    //                 `${process.env.NEXT_PUBLIC_API_URL}/api/couponlist`,
    //                 { userId },
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }
    //             );

    //             if (response.data.result && response.data.data) {
    //                 setCouponList(response.data.data);
    //             }
    //         } catch (error) {
    //             console.error('쿠폰 목록을 가져오는데 실패했습니다:', error);
    //         }
    //     };

    //     fetchProfileData();
    // }, [form]);

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
        console.log('리뷰 페이지로 이동:', orderListId, productId);
        if (orderListId && productId) {
            Router.push(`./review/write?orderListId=${orderListId}&productId=${productId}`);
        } else {
            console.error('orderListId 또는 productId가 부족합니다');
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
                case 'Pending':
                    return <span style={{ color: 'orange' }}>결제 대기중</span>;
                case 'Completed':
                    return <span style={{ color: 'green' }}>배송 완료</span>;
                case 'Cancelled':
                    return <span style={{ color: 'red' }}>주문 취소</span>;
                default:
                    return '알 수 없음';
            }
        }
    };

    return (
        <div className={style.profileContainer}>
            <h1 className={style.Title}>MY PAGE</h1>
            <div className={style.infoRow}>
                <div className={style.userInfoContainer}>
                    <Image src="/pr.png" alt="Profile Image" width={100} height={100} />
                    <div className={style.userDetails}>
                        <div className={style.username}>
                            <span className={style.name}>{name}</span>
                            <span className={style.loginID}>({loginID})</span>
                        </div>
                        <Button onClick={() => Router.push('/profile/edit')} className={style.editButton}>
                            회원정보 수정
                        </Button>
                    </div>
                </div>

                <div className={style.summaryContainer}>
                    <div className={style.summaryItem}>
                        <span>쿠폰</span>
                        <span className={style.summaryValue}>{couponCount}</span>
                    </div>
                    <div className={style.summaryItem}>
                        <span>포인트</span>
                        <span className={style.summaryValue}>{point.toLocaleString()}</span>
                    </div>
                    <div className={style.summaryItem}>
                        <span>작성가능 리뷰</span>
                        <span className={style.summaryValue}>{reviewCount}</span>
                    </div>
                </div>
            </div>

            <div className={style.orderStatusContainer}>
                <div className={style.orderStatusItem}>
                    <span>입금대기중</span>
                    <span>{orderSummary.pending}</span>
                </div>
                <div className={style.arrow}>›</div>
                <div className={style.orderStatusItem}>
                    <span>결제완료</span>
                    <span>{orderSummary.inPreparation}</span>
                </div>
                <div className={style.arrow}>›</div>
                {/* <div className={style.orderStatusItem}>
                    <span>배송준비중</span>
                    <span>{orderSummary.shipping}</span>
                </div>
                <div className={style.arrow}>›</div> */}
                <div className={style.orderStatusItem}>
                    <span>배송완료</span>
                    <span>{orderSummary.completed}</span>
                </div>
            </div>

            <Tabs defaultActiveKey="1">
                <TabPane tab="구매 정보" key="1">
                    <div className={style.sectionTitle}>구매 정보</div>
                    <div className={style.sectionContainer}>
                        {orderList.map((item, index) => (
                            <div key={index} className={style.orderItem}>
                                <div className={style.orderDetails}>
                                    <img
                                        src={item.Product.Image}
                                        alt="Product Image"
                                        width={50}
                                        height={50}
                                        className={style.productImage}
                                    />
                                    <div className={style.productInfo}>
                                        <div className={style.productNamePrice}>
                                            <span className={style.productName}>{item.Product.ProductName}</span>
                                            <span className={style.productPrice}>{item.Amount.toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.orderQuantity}>{item.Quantity || 1}개</div>
                                <div className={style.orderDate}>{new Date(item.OrderDate).toLocaleString()}</div>
                                <div className={style.orderStatus}>
                                    {StatusText(item.OrderStatus, item.TransactionStatus)}
                                </div>
                                <div className={style.reviewButton}>
                                    {item.OrderStatus === 'Completed' && !item.hasReview ? (
                                        <span
                                            onClick={() => handleReviewClick(item.OrderListID, item.Product.ProductID)}>
                                            리뷰 작성
                                        </span>
                                    ) : item.OrderStatus === 'Completed' && item.hasReview ? (
                                        <span style={{ color: 'gray' }}>리뷰 작성 완료</span>
                                    ) : (
                                        <span style={{ color: 'gray' }}>-</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabPane>

                <TabPane tab="포인트 정보" key="2">
                    <div className={style.sectionContainer}>
                        {pointList.length > 0 ? (
                            pointList.map((item, index) => (
                                <div key={index} className={style.pointItem}>
                                    <div className={style.itemInfo}>
                                        포인트: {item.Amount}
                                        <span
                                            style={{
                                                color: item.Amount < 0 ? 'red' : 'blue',
                                                marginLeft: '10px',
                                            }}>
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
                </TabPane>

                <TabPane tab="쿠폰 정보" key="3">
                    <div className={style.sectionContainer}>
                        {couponList.length > 0 ? (
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
                </TabPane>

                <TabPane tab="1:1 문의" key="4">
                    <div className={style.sectionContainer}>
                        <p>1:1 문의 내용이 여기에 표시됩니다.</p>
                    </div>
                </TabPane>

                <TabPane tab="상품 문의" key="5">
                    <div className={style.sectionContainer}>
                        <p>상품 문의 내용이 여기에 표시됩니다.</p>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Profile;
