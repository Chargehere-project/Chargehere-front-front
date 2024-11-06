import React from 'react';
import styles from './menu.module.css';
const Menu = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <a href="/mall">홈</a>
                </li>
                <li className={styles.navItem}>
                    <a href="/mall/product">제품</a>
                </li>
                <li className={styles.navItem}>
                    <a href="/mall/review">리뷰</a>
                </li>
                <li className={styles.navItem}>
                    <a href="/mall/#">CS</a>
                </li>
            </ul>
        </nav>
    );
};
export default Menu;
