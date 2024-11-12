import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './Swipe.module.css';

const MainSwipe = () => {
    const router = useRouter();
    
    return (
        <div className={styles.swiperContainer}>
            <Swiper
                centeredSlides={true}
                spaceBetween={50}
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                modules={[Pagination, Autoplay]}
                className={styles.swiper}
            >
                <SwiperSlide onClick={() => router.push('/event/1')}>
                    <div className={styles.slideImageContainer}>
                        <Image
                            src="/main_banner1.png"
                            alt="Slide 1"
                            layout="responsive"
                            width={1400} // 원본 이미지의 가로 크기
                            height={640} // 원본 이미지의 세로 크기
                            priority
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide onClick={() => router.push('/event/2')}>
                    <div className={styles.slideImageContainer}>
                    <Image
                            src="/main_banner2.png"
                            alt="Slide 2"
                            layout="responsive"
                            width={1400} // 원본 이미지의 가로 크기
                            height={640} // 원본 이미지의 세로 크기
                            priority
                        />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default MainSwipe;