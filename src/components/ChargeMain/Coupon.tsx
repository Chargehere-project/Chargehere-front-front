import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
const Coupon = () => {
    const [couponName, setCouponName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [couponDate, setCouponDate] = useState<string | null>(null);
    useEffect(() => {
        const useCoupon = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/coupon`);
                console.log(response.data, '데이터');
                setCouponName(response.data.data);
                setCouponDate(response.data.date);
                setError(null);
            } catch (error) {
                setCouponName(null);
                setCouponDate(null);
                setError('쿠폰 조회 중에 문제가 발생하였습니다.');
            }
        };
        useCoupon();
    }, []);
    return (
        <>
            <div>
                {error ? (
                    <p>{error}</p>
                ) : couponName ? (
                    <>
                        <div>
                            <div>{couponName}</div>
                            <div>{couponDate}</div>
                        </div>
                    </>
                ) : (
                    <p>쿠폰 정보가 없습니다.</p>
                )}
            </div>
        </>
    );
};
export default Coupon;