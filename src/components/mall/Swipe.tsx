import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import SwipeStyled from './swipestyled';
import axios from 'axios';

const MainSwipe = () => {
    const router = useRouter();
    const [banner1Url, setBanner1Url] = useState('/main_banner1.png'); // 기본 배너 1 이미지
    const [banner2Url, setBanner2Url] = useState('/main_banner2.png'); // 기본 배너 2 이미지

    useEffect(() => {
        // S3에서 배너 이미지를 가져오는 함수
        const fetchBanners = async () => {
            try {
                const response1 = await axios.get('/api/admin/files/banner1');
                const response2 = await axios.get('/api/admin/files/banner2');

                if (response1.data.fileUrl) {
                    setBanner1Url(response1.data.fileUrl);
                }
                if (response2.data.fileUrl) {
                    setBanner2Url(response2.data.fileUrl);
                }
            } catch (error) {
                console.error('Failed to fetch banners from S3:', error);
            }
        };

        fetchBanners();
    }, []);

    return (
        <SwipeStyled>
            <div className="swiperContainer">
                <Swiper
                    centeredSlides={true}
                    spaceBetween={50}
                    loop={true}
                    autoplay={{ delay: 5000 }}
                    pagination={{ clickable: true }}
                    modules={[Pagination, Autoplay]}
                    className="swiper">
                    <SwiperSlide onClick={() => router.push('/map')}>
                        <div className="slideImageContainer">
                            <Image src={banner1Url} alt="Slide 1" fill className="slideImage" priority />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide onClick={() => router.push('/mall/product')}>
                        <div className="slideImageContainer">
                            <Image src={banner2Url} alt="Slide 2" fill className="slideImage" priority />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </SwipeStyled>
    );
};

export default MainSwipe;
