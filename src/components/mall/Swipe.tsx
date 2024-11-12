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
                    <div style={{ position: 'relative', width: '100%', height: '640px' }}>
                        <Image
                            src="/main_banner1.png" // public 폴더의 main_banner1.png 사용
                            alt="Slide 1"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide onClick={() => router.push('/event/2')}>
                    <div style={{ position: 'relative', width: '100%', height: '640px' }}>
                        <Image
                            src="/main_banner2.png" // public 폴더의 main_banner2.png 사용
                            alt="Slide 2"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default MainSwipe;
