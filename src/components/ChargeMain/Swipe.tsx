import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './Swipe.module.css';

interface MainSwipeProps {
    banners: string[]; // 배너 이미지 URL을 담은 배열
}


const MainSwipe: React.FC<MainSwipeProps> = ({ banners }) => {
    const router = useRouter();
    return (
        <div className={styles.swiperContainer}>
            <Swiper
                centeredSlides={true}
                spaceBetween={50}
                loop={true}
                autoplay={{ delay: 5000 }}
                navigation
                pagination={{ clickable: true }}
                modules={[Pagination, Navigation, Autoplay]}
                className={styles.swiper}>
                {banners.map((banner, index) => (
                    <SwiperSlide key={index} onClick={() => router.push(`/event/${index + 1}`)}>
                        <Image src={banner} alt={`Slide ${index + 1}`} width={1200} height={600} />
                        {index === 2 && (
                            <div className={styles.slideContent}>
                                <h2>당신을 위한 쇼핑몰</h2>
                                <p>쉽고 빠른 스타일링 이제 on style과 함께하세요</p>
                            </div>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MainSwipe;
