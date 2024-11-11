import Router from 'next/router';
import MainSwipe from './Swipe';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { RobotFilled } from '@ant-design/icons';
import Coupon from './Coupon';
import Roulette from '../Roulette';
import styles from './Index.module.css';


const Main = () => {
    const [announcements, setAnnouncements] = useState<string[]>([]);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notice`);
                console.log('서버 응답:', response.data); // 전체 응답 데이터 확인
                
                if (response.data.result) {
                    console.log('공지사항 데이터:', response.data.data); // notices 배열 확인
                    setAnnouncements(response.data.data);
                }
            } catch (error) {
                console.error('공지사항을 불러오는 중 오류가 발생했습니다:', error);
                setAnnouncements([]);
            } finally {
                setIsLoading(false);
            }
        };

        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        fetchAnnouncements();
        checkLoginStatus();
    }, []);
    useEffect(() => {
        if (announcements.length > 1) {
            const timer = setInterval(() => {
                setIsVisible(false);  // 먼저 현재 공지를 페이드 아웃
                
                setTimeout(() => {
                    setCurrentAnnouncementIndex(prev => 
                        prev >= announcements.length - 1 ? 0 : prev + 1
                    );
                    setIsVisible(true);  // 새로운 공지를 페이드 인
                }, 500);  // 페이드 아웃 후 0.5초 뒤에 다음 공지로 변경
            }, 3000);  // 3초마다 변경

            return () => clearInterval(timer);
        }
    }, [announcements]);

    const announcementStyle = {
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
    };


    const handleNavigation = (path: string) => {
        Router.push(path);
    };


    return (
        <>
            <div className={styles.container}>
                {!isLoggedIn ? (
                    <p className={styles.loginNotice}>로그인 후 이용 가능합니다.</p>
                ) : (
                    <div className={styles.button} onClick={() => handleNavigation('/map')}>
                        충전소 찾기
                    </div>
                )}
                <MainSwipe />
                <div className={styles.buttonContainer}>
                                            {/* 충전하기 버튼 추가 */}
                                            <div className={styles.button} onClick={() => handleNavigation('/charging')}>
                            충전하기
                        </div>
                </div>
                <div className={styles.announcementContainer}>
                    <h2>공지</h2>
                    <div
                        className={styles.announcement}
                        onClick={() => handleNavigation('/notice')}
                        style={announcementStyle}
                    >
                        {announcements.length > 0 
                            ? announcements[currentAnnouncementIndex]
                            : '공지사항이 없습니다.'}
                    </div>
                </div>
                <Coupon />
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
