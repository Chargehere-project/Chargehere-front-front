import React from 'react';
import ReviewStyled from './styled';

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
      <span key={i} className={i < rating ? 'starFilled' : 'starEmpty'}>★</span>
    ));
  };

  return (
    <ReviewStyled>
      <div className= 'reviewPage'>
      <h2 className= 'pageTitle'>리뷰</h2>
      {reviews.length === 0 ? (
        <p className= 'noReviewsMessage'>아직 작성된 리뷰가 없습니다.</p>
      ) : (
        reviews.map(({ reviewId, userName, rating, content, reviewDate, userImage }) => (
          <div key={reviewId} className= 'reviewItem'>
            <div className= 'reviewHeader'>
              <img src={userImage} alt={`${userName} profile`} className= 'userImage' />
              <div className= 'userInfo'>
                <h3 className= 'userName'>{userName}</h3>
                <p className= 'reviewDate'>{new Date(reviewDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className= 'reviewBody'>
              <div className= 'rating'>{renderStars(rating)} ({rating} / 5)</div>
              <p className= 'reviewContent'>{content}</p>
            </div>
          </div>
        ))
      )}
    </div>
    </ReviewStyled>
    
  );
}

export default ReviewItem;
