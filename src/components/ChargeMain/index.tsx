import Router from 'next/router';
import MainSwipe from './Swipe';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { RobotFilled } from '@ant-design/icons';
import Coupon from './Coupon';
import Roulette from '../Roulette';
import styles from './Index.module.css';
const Main= () => {
    const [announcement, setAnnouncement] = useState<string>('');
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
    }, []);
    const handleNavigation = (path: string) => {
        Router.push(path);
    };
    const charge = () => {
        Router.push('/charge');
    };
    const notice = () =>{
        Router.push('/notice')
    }
    return (
        <>
            <div className={styles.container}>
                <p className={styles.loginNotice}>로그인 후 이용 가능합니다.</p>
                <MainSwipe />
                <div className={styles.buttonContainer}>
                    <div className={styles.button} onClick={() => handleNavigation('/map')}>충전소 찾기</div>
                    <div className={styles.button} onClick={() => handleNavigation('/cash')}>요금 안내</div>
                    <div className={styles.button} onClick={() => handleNavigation('/charge')}>충전하기</div>
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
                    <Roulette/>
                </div>
            </div>
        </>
    );
};
export default Main;