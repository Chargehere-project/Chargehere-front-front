"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import CountUp from 'react-countup';
import Link from 'next/link';  // Link 컴포넌트 사용
const MainBanner = () => {
    const secondSectionRef = useRef<HTMLDivElement | null>(null);
    const thirdSectionRef = useRef<HTMLDivElement | null>(null);
    const fourthSectionRef = useRef<HTMLDivElement | null>(null);
    const fifthSectionRef = useRef<HTMLDivElement | null>(null);
    const sixthSectionRef = useRef<HTMLDivElement | null>(null);
    const [isCountUpActive, setIsCountUpActive] = useState(false);  // CountUp하는거(숫자 올라가는거)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.fadeInSection);
                        // 여섯 번째 섹션이 보이면 카운트업 하도록 하기
                        if (entry.target === sixthSectionRef.current) {
                            setIsCountUpActive(true);
                        }
                    } else {
                        // 여섯 번째 섹션이 화면에서 벗어나면 카운트업 끄기
                        if (entry.target === sixthSectionRef.current) {
                            setIsCountUpActive(false);
                        }
                    }
                });
            },
            { threshold: 0.5 }  // 섹션이 절반 이상 보일 때 애니메이션 실행
        );
        if (secondSectionRef.current) observer.observe(secondSectionRef.current);
        if (thirdSectionRef.current) observer.observe(thirdSectionRef.current);
        if (fourthSectionRef.current) observer.observe(fourthSectionRef.current);
        if (fifthSectionRef.current) observer.observe(fifthSectionRef.current);
        if (sixthSectionRef.current) observer.observe(sixthSectionRef.current);
        return () => {
            if (secondSectionRef.current) observer.unobserve(secondSectionRef.current);
            if (thirdSectionRef.current) observer.unobserve(thirdSectionRef.current);
            if (fourthSectionRef.current) observer.unobserve(fourthSectionRef.current);
            if (fifthSectionRef.current) observer.unobserve(fifthSectionRef.current);
            if (sixthSectionRef.current) observer.unobserve(sixthSectionRef.current);
        };
    }, []);
    return (
        <div style={{width: '100%', margin: '0', padding:'0'}}>
            {/* 첫 번째 섹션 */}
            <div className={styles.mainBanner}>
                <div className={styles.bannerContent}>
                    <h1 className={styles.fadeIn}>충전이 필요한 모든 순간, ChargeHere</h1>
                    <Link href="/map">
                        <button className={styles.fadeInButton}>충전소 찾기</button>
                    </Link>
                    <Link href="/mall">
                        <button className={styles.fadeInButton}>쇼핑몰 가기</button>
                    </Link>
                </div>
            </div>
            {/* 두 번째 섹션 */}
            <div className={styles.secondSection} ref={secondSectionRef}>
                <div className={styles.textContainer}>
                    <h2>24시간 언제나.</h2>
                    <p>
                        한밤중이나 주말에도<br />
                        시간에 구애받지 않고<br />
                        충전하세요.
                    </p>
                </div>
                <div className={styles.imageContainer}>
                    <img src="/intro1.png" alt="intro1img" className={styles.image} />
                </div>
            </div>
            {/* 세 번째 섹션 */}
            <div className={styles.thirdSection} ref={thirdSectionRef}>
                <div className={styles.textContainer}>
                    <h2>원하는 곳에서.</h2>
                    <p>
                        내 주변 가까운 충전존에서<br />
                        혹은 내가 원하는 곳에서<br />
                        어디서나 편하게 충전하세요.
                    </p>
                </div>
                <div className={styles.imageContainer}>
                    <img src="/intro2.jpg" alt="intro2img" className={styles.image} />
                </div>
            </div>
            {/* 네 번째 섹션 */}
            <div className={styles.fourthSection} ref={fourthSectionRef}>
                <div className={styles.textContainer}>
                    <h2>저렴하고 편안하게.</h2>
                    <p>
                        안전한 충전으로 <br />
                        낮은 가격으로 저렴하게<br />
                        충전하세요.
                    </p>
                </div>
                <div className={styles.imageContainer}>
                    <img src="/intro3.jpg" alt="intro3img" className={styles.image} />
                </div>
            </div>
            {/* 다섯 번째 섹션 */}
            <div className={styles.fifthSection} ref={fifthSectionRef}>
                <div className={styles.textContainer}>
                    <h2>웹으로 편리하게.</h2>
                    <p>
                        Chargehere과 함께<br />
                        웹버전으로 빠르게<br />
                        QR코드로 충전하세요.
                    </p>
                </div>
                <div className={styles.imageContainer}>
                    <img src="/intro4.png" alt="intro4img" className={styles.image} />
                </div>
            </div>
            {/* 여섯 번째 섹션 */}
            <div className={styles.sixthSection} ref={sixthSectionRef}>
                <div className={styles.sixthText}>
                    <h1>
                        {isCountUpActive && <CountUp end={239173} duration={3} separator="," />}명의 회원이 ChargeHere와 함께하고 있습니다.
                    </h1>
                    <p>지금 바로 <a href="#">Chargehere</a>를 시작하세요.</p>
                </div>
            </div>
        </div>
    );
}
export default MainBanner;







