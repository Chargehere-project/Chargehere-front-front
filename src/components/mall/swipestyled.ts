import styled from 'styled-components';

const SwipeStyled = styled.div`

.swiperContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vw / 2.1875); 
    overflow: hidden;
    position: relative;
}

.swiperContainer :global .swiper-pagination-bullet {
    background-color: #fff;
    opacity: 0.7;
    bottom: 20px !important; /* 기본값 */
}

.swiperContainer :global .swiper-pagination-bullet-active {
    opacity: 1;
}

.swiper {
    width: 100%;
    height: 100%;
}

.slideImageContainer {
    position: relative;
    width: 100%;
    height: 100%; /* 부모 컨테이너에 맞춰 높이 설정 */
    cursor: pointer;
}

.slideImage {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지 비율을 유지하면서 가로/세로 꽉 채우기 */
}

/* 반응형 설정 */
@media screen and (max-width: 1024px) {
    .swiperContainer {
        height: 480px;
    }
}

@media screen and (max-width: 768px) {
    .swiperContainer {
        height: 360px;
    }
    .swiperContainer :global .swiper-pagination-bullets {
        bottom: 10px !important;
    }
}

@media screen and (max-width: 480px) {
    .swiperContainer {
        height: 160px;
    }
    .swiperContainer :global .swiper-pagination-bullets {
        bottom: 5px !important;
    }
}


`;

export default SwipeStyled;