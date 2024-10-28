import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './Swipe.module.css';
const Swipe = () => {
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
                className={styles.swiper}
            >
                <SwiperSlide onClick={() => router.push('/event/1')}>
                    <Image src="/colla.png" alt="Slide 1" width={1200} height={600} />
                </SwiperSlide>
                <SwiperSlide onClick={() => router.push('/event/2')}>
                    <Image src="/game.png" alt="Slide 2" width={1200} height={600} />
                </SwiperSlide>
                <SwiperSlide onClick={() => router.push('/event/3')}>
                    <Image src="/style.png" alt="Slide 3" width={1200} height={600} />
                    <div className={styles.slideContent}>
                        <h2>당신을 위한 쇼핑몰</h2>
                        <p>쉽고 빠른 스타일링 이제 on style과 함께하세요</p>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};
export default Swipe;