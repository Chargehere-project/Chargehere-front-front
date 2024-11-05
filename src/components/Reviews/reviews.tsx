import React, { useState } from 'react';
import Menu from '../mall/menu';
interface ReviewProps {
  reviewId: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  rating: number;
  content: string;
  reviewDate: string;
  userImage: string;
}
const ReviewItem= ({
  userName,
  productName,
  rating,
  content,
  reviewDate,
  userImage
}:ReviewProps) => {
  // 별점을 시각적으로 보여주기
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={i <= rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };
  return (
      <div>
        <Menu />
        <div style={styles.reviewItem}>
          <div style={styles.reviewHeader}>
            <img src={userImage} alt={`${userName} profile`} style={styles.userImage} />
            <div>
              <h3>{userName}</h3>
              <p>{new Date(reviewDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div style={styles.reviewBody}>
            <p style={styles.productInfo}>상품: {productName}</p>
            <div style={styles.rating}>{renderStars(rating)} ({rating} / 5)</div>
            <p>{content}</p>
          </div>
        </div>
      </div>
  );
};
// Pagination을 위한 인터페이스
interface PaginatedReviewsProps {
  reviews: ReviewProps[];
  itemsPerPage: number;
}
const PaginatedReviews: React.FC<PaginatedReviewsProps> = ({ reviews = [], itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const currentReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <div>
      {/* 리뷰 총 개수 표시 */}
      <div style={styles.reviewCount}>
        총 {reviews.length}개의 리뷰
      </div>
      {/* 리뷰 그리드 표시 */}
      <div style={styles.reviewGrid}>
        {currentReviews.map((review) => (
          <ReviewItem key={review.reviewId} {...review} />
        ))}
      </div>
      {/* 페이지네이션 */}
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            style={styles.pageButton}
            onClick={() => handlePageChange(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
// 스타일 추가 및 수정
const styles = {
  reviewItem: {
    border: '1px solid #ccc',
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  userImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  reviewBody: {
    textAlign: 'left' as 'left',
  },
  productInfo: {
    fontWeight: 'bold',
  },
  rating: {
    margin: '10px 0',
    fontSize: '20px',
    color: '#FFCC00',
  },
  starFilled: {
    color: '#FFCC00',
  },
  starEmpty: {
    color: '#ddd',
  },
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',  // 3개씩 그리드로 정렬
    gap: '20px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  pageButton: {
    margin: '0 5px',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  reviewCount: {
    textAlign: 'left' as 'left',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};
export default PaginatedReviews;