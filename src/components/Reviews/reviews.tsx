import React from 'react';
import styles from './review.module.css';

interface ReviewProps {
  reviewId: number;
  userName: string;
  rating: number;
  content: string;
  reviewDate: string;
  userImage: string;
}

function ReviewItem({ userName, rating, content, reviewDate, userImage }: ReviewProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
    ));
  };

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <img src={userImage} alt={`${userName} profile`} className={styles.userImage} />
        <div>
          <h3 className={styles.userName}>{userName}</h3>
          <p className={styles.reviewDate}>{new Date(reviewDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={styles.reviewBody}>
        <div className={styles.rating}>{renderStars(rating)} ({rating} / 5)</div>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default ReviewItem;