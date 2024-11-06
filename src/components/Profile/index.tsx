import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';
import style from './profile.module.css';

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
    Amount: number;
    OrderDate: string;
    OrderStatus: 'Pending' | 'Completed' | 'Cancelled';
    Product: Product;
    hasReview: boolean;
}

const Profile = () => {
    const [name, setName] = useState<string>('');
    const [point, setPoint] = useState<string>('');
    const [pointList, setPointList] = useState<PointItem[]>([]);
    const [couponList, setCouponList] = useState<CouponItem[]>([]);
    const [orderList, setOrderList] = useState<OrderItem[]>([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            let userId;
            try {
                const decoded: any = jwtDecode(token);
                userId = decoded.UserID;
            } catch (error) {
                console.error('토큰 디코드 에러:', error);
                return;
            }

            try {
                const response = await axios.post(
                    'http://localhost:8000/name',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setName(`${response.data.name}`);
                setPoint(response.data.point);
            } catch (error) {
                console.error('이름을 가져오는데 실패했습니다:', error);
            }

            try {
                const response = await axios.post(
                    'http://localhost:8000/orderlist',
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
                    'http://localhost:8000/pointlist',
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
                    'http://localhost:8000/couponlist',
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
    }, []);

    const handleReviewClick = (orderId: number, productId: number) => {
        Router.push(`/review/write?orderId=${orderId}&productId=${productId}`);
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
                            <div className={style.itemInfo}>포인트: {item.Amount}</div>
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
        </div>
    );
};

export default Profile;
