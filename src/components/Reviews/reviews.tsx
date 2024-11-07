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

interface ReviewItemProps {
  reviews?: ReviewProps[]; // 선택적 프로퍼티로 지정
}

function ReviewItem({ reviews = [] }: ReviewItemProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
    ));
  };

  return (
    <div className={styles.reviewPage}>
      <h2 className={styles.pageTitle}>리뷰</h2>
      {reviews.length === 0 ? (
        <p className={styles.noReviewsMessage}>아직 작성된 리뷰가 없습니다.</p>
      ) : (
        reviews.map(({ reviewId, userName, rating, content, reviewDate, userImage }) => (
          <div key={reviewId} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <img src={userImage} alt={`${userName} profile`} className={styles.userImage} />
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{userName}</h3>
                <p className={styles.reviewDate}>{new Date(reviewDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={styles.reviewBody}>
              <div className={styles.rating}>{renderStars(rating)} ({rating} / 5)</div>
              <p className={styles.reviewContent}>{content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewItem;
