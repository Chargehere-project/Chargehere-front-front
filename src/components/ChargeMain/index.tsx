import Router from 'next/router';
import MainSwipe from './Swipe';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { RobotFilled } from '@ant-design/icons';
import Coupon from './Coupon';
import Roulette from '../Roulette';
import styles from './Index.module.css';

const Main = () => {
    const [announcement, setAnnouncement] = useState<string>('');
    const [banners, setBanners] = useState<string[]>(['/colla.png', '/game.png', '/style.png']); // 초기값 설정

    // 로컬 스토리지에서 배너 데이터를 가져오는 함수
    useEffect(() => {
        const storedBanners = JSON.parse(localStorage.getItem('banners') || 'null');
        if (storedBanners) {
            setBanners(storedBanners);
        }
    }, []);


    // 공지사항 데이터를 가져오는 함수
    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await axios.get('http://localhost:8000/notice');
                setAnnouncement(response.data.data); // 백엔드 응답 구조에 따라 조정
            } catch (error) {
                console.error('공지사항을 가져오는 데 실패했습니다:', error);
            }
        };
        fetchAnnouncement();
    }, []); // 빈 배열로 설정하여 한 번만 실행

    const handleNavigation = (path: string) => {
        Router.push(path);
    };

    return (
        <>
            <div className={styles.container}>
                <p className={styles.loginNotice}>로그인 후 이용 가능합니다.</p>
                <MainSwipe banners={banners} /> {/* banners 상태를 props로 전달 */}
                <div className={styles.buttonContainer}>
                    <div className={styles.button} onClick={() => handleNavigation('/map')}>
                        충전소 찾기
                    </div>
                    <div className={styles.button} onClick={() => handleNavigation('/cash')}>
                        요금 안내
                    </div>
                    <div className={styles.button} onClick={() => handleNavigation('/charge')}>
                        충전하기
                    </div>
                </div>
                <div className={styles.announcementContainer}>
                    <h2>공지</h2>
                    <div className={styles.announcement} onClick={() => handleNavigation('/notice')}>
                        {announcement || '공지사항이 없습니다.'}
                    </div>
                </div>
                <Coupon />
                {/* 띠 배너 */}
                <div className={styles.banner} onClick={() => handleNavigation('/mall')}>
                    <p>지금 Chargemall에서 다양한 혜택을 만나보세요! →</p>
                </div>
                <div>
                    <p>출석만 해도 포인트가!</p>
                    <Roulette />
                </div>
            </div>
        </>
    );
};

export default Main;
