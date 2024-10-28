import React from 'react';
import styles from './menu.module.css';
const menu = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><a href="./mall">홈</a></li>
        <li className={styles.navItem}><a href="./product">제품</a></li>
        <li className={styles.navItem}><a href="/reviews">리뷰</a></li>
        <li className={styles.navItem}><a href="#">CS</a></li>
      </ul>
    </nav>
  );
};
export default menu;