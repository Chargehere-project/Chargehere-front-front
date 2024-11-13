import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import SwipeStyled from './swipestyled';

const MainSwipe = () => {
    const router = useRouter();

    return (
        <SwipeStyled>
             <div className= 'swiperContainer'>
            <Swiper
                centeredSlides={true}
                spaceBetween={50}
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                modules={[Pagination, Autoplay]}
                className= 'swiper'>
                <SwiperSlide onClick={() => router.push('/event/1')}>
                    <div className= 'slideImageContainer'>
                        <Image src="/main_banner1.png" alt="Slide 1" fill className= 'slideImage' priority  />
                    </div>
                </SwiperSlide>
                <SwiperSlide onClick={() => router.push('/event/2')}>
                    <div className= 'slideImageContainer'>
                        <Image src="/main_banner2.png" alt="Slide 2" fill className= 'slideImage' priority />
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>

        </SwipeStyled>
       
    );
};

export default MainSwipe;
