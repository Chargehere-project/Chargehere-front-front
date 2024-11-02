import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Router from 'next/router';

interface ChargeItem {
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
    Amonut: number;
    OrderDate: string;
    OrderStatus: 'Pending' | 'Completed' | 'Cancelled';
    Product: Product;
    hasReview: boolean;
}

const Profile = () => {
    const [name, setName] = useState<string>('');
    const [point, setPoint] = useState<string>('');
    const [productName, setProductName] = useState<string>('');
    const [chargeList, setChargeList] = useState<ChargeItem[]>([]);
    const [couponList, setCouponList] = useState<CouponItem[]>([]);
    const [orderList, setOrderList] = useState<OrderItem[]>([]);

    useEffect(() => {
        const NamePoint = async () => {
            const token = () => {
                const token = localStorage.getItem('token');
                if (!token) return null;
                try {
                    const decoded: any = jwtDecode(token);
                    return decoded.UserID;
                } catch (error) {
                    console.error('토큰 디코드 에러:', error);
                    return null;
                }
            };
            const userId = token();
            try {
                const response = await axios.post(
                    'http://localhost:8000/name',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setName(response.data.name);
                setPoint(response.data.point);
            } catch (error) {
                console.error('이름을 가져오는데 실패했습니다.');
            }
            try {
                const response = await axios.post(
                    'http://localhost:8000/orderlist',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setOrderList(response.data.data);
            } catch (error) {
                console.error('구매내역을 가져오는데 실패했습니다.');
            }
            try {
                const response = await axios.post(
                    'http://localhost:8000/chargelist',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (response.data.result && response.data.data) {
                    setChargeList(response.data.data);
                }
            } catch (error) {
                console.error('충전내역을 가져오는데 실패했습니다.');
            }
            try {
                const response = await axios.post(
                    'http://localhost:8000/couponlist',
                    { userId },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                if (response.data.result && response.data.data) {
                    setCouponList(response.data.data);
                }
            } catch (error) {
                console.error('충전내역을 가져오는데 실패했습니다.');
            }
        };
        NamePoint();
    }, []);
    const handleReviewClick = (orderId: number, productId: number) => {
        Router.push(`/review/write?orderId=${orderId}&productId=${productId}`);
    };

    const StatusText = (status: string) => {
        switch (status) {
            case 'Pending':
                return '배송중';
            case 'Completed':
                return '배송완료';
            case 'Cancelled':
                return '주문 취소';
            default:
                return '알 수 없음';
        }
    };

    return (
        <>
            <Image src="/main.png" alt="logo" width={100} height={100} />
            <div>{name}</div>
            <div>보유포인트:{point}</div>
            <div>구매내역</div>
            <div>
                {orderList && orderList.length > 0 ? (
                    orderList.map((item, index) => (
                        <div key={index}>
                            <div>상품명: {item.Product.ProductName}</div>
                            <div>주문일자: {item.OrderDate}</div>
                            <div>총 금액: {item.Amonut}</div>
                            <div>주문상태: {StatusText(item.OrderStatus)}</div>
                            {item.OrderStatus === 'Completed' &&
                                !item.hasReview && ( 
                                    <div
                                        onClick={() => handleReviewClick(item.OrderID, item.Product.ProductID)}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#7196DB',
                                            marginTop: '10px',
                                            padding: '8px',
                                            border: '1px solid #7196DB',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        리뷰 작성하기
                                    </div>
                                )}
                            {item.OrderStatus === 'Completed' &&
                                item.hasReview && (
                                    <div
                                        style={{
                                            marginTop: '10px',
                                            padding: '8px',
                                            color: 'gray',
                                            textAlign: 'center',
                                        }}
                                    >
                                        리뷰 작성 완료
                                    </div>
                                )}
                        </div>
                    ))
                ) : (
                    <div>구매 내역이 없습니다.</div>
                )}
            </div>
            <div>충전내역</div>
            <div>
                {chargeList && chargeList.length > 0 ? (
                    chargeList.map((item, index) => (
                        <div key={index}>
                            <div>{item.Amount}</div>
                            <div>{item.ChargeDate}</div>
                        </div>
                    ))
                ) : (
                    <div>충전 내역이 없습니다.</div>
                )}
            </div>
            <div>쿠폰 목록</div>
            <div>
                {couponList && couponList.length > 0 ? (
                    couponList.map((item, index) => (
                        <div key={index}>
                            <div>{item.Coupon.CouponName}</div>
                            <div>{item.Coupon.StartDate}</div>
                            <div>{item.Coupon.ExpirationDate}</div>
                            <div>{item.isUsed ? '사용완료' : '미사용'}</div>
                        </div>
                    ))
                ) : (
                    <div>쿠폰이 없습니다.</div>
                )}
            </div>
        </>
    );
};

export default Profile;
