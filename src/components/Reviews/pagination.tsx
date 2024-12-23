import React, { useState } from 'react';
import ReviewItem from './reviews';
import PageStyled from './pagestyled';

interface ReviewProps {
  reviewId: number;
  userName: string;
  rating: number;
  content: string;
  reviewDate: string;
  userImage: string;
}

interface PaginatedReviewsProps {
  reviews?: ReviewProps[];
  itemsPerPage: number;
}

function PaginatedReviews({ reviews = [], itemsPerPage }: PaginatedReviewsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<'latest' | 'highRating'>('latest');

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const averageRating = reviews.length
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  const currentReviews = sortedReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (option: 'latest' | 'highRating') => {
    setSortOption(option);
    setCurrentPage(1);
  };

  return (
    <PageStyled>
      <div className= 'reviewContainer'>
      <div className= 'sortContainer'>
        <span>평균 평점: {averageRating} / 5</span>
        <select onChange={(e) => handleSortChange(e.target.value as 'latest' | 'highRating')} className= 'sortSelect'>
          <option value="latest">최신순</option>
          <option value="highRating">평점 높은순</option>
        </select>
      </div>

      <div className= 'reviewGrid'>
        {currentReviews.map((review) => (
          <ReviewItem key={review.reviewId} {...review} />
        ))}
      </div>

      <div className= 'pagination'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`$ 'pageButton' ${index + 1 === currentPage ? 'pageButtonActive' : ''}`}
            onClick={() => handlePageChange(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>

    </PageStyled>
    
  );
}

export default PaginatedReviews;
