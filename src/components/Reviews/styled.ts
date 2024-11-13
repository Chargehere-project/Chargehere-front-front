import styled from 'styled-components';

const ReviewStyled = styled.div`
.reviewPage {
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;
  border-radius: 10px;
}

.pageTitle {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* 리뷰 아이템 스타일 */
.reviewItem {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s;
}


.reviewHeader {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.userImage {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 15px;
  border: 1px solid #ddd;
  object-fit: cover;
}

.userInfo {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #333;
}

.userName {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
  color: #333;
}

.reviewDate {
  color: #888;
  font-size: 12px;
}

/* 리뷰 본문 스타일 */
.reviewBody {
  margin-top: 10px;
}

.rating {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #ffc107;
  margin-bottom: 10px;
}

.starFilled {
  color: #ffc107;
}

.starEmpty {
  color: #ddd;
}

/* 리뷰 내용 텍스트 */
.reviewContent {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-top: 10px;
}

/* 리뷰가 없는 경우 메시지 */
.noReviewsMessage {
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 20px;
}

`;

export default ReviewStyled;