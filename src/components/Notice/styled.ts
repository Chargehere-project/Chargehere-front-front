import styled from 'styled-components';

const NoticeStyled = styled.div`

.noticeContainer {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  .noticeTitle {
    font-size: 2em;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  .noticeTable {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .noticeTable th,
  .noticeTable td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: center;
  }
  .noticeTable th {
    background-color: #F4F4F4;
    font-weight: bold;
  }
  /* 번호와 작성자의 크기 줄이기 */
  .noticeTable td:nth-child(1),  /* 번호 */
  .noticeTable td:nth-child(3) {  /* 작성자  */
    font-size: 0.9em;
    width: 10%;
    color: #888; /* 색상을 연하게 */
  }
  /* 제목의 크기를 더 크게 하고, 여백 추가 */
  .noticeTable td:nth-child(2) {  /* 제목 컬럼 */
    font-size: 1.2em;
    font-weight: bold;
    text-align: left;
    padding-left: 15px;
    width: 60%;
    position: relative; /* 아이콘 배치를 위해 */
  }
  /* 제목 앞에 아이콘 추가 (아이콘 변경 필요) */
  /* .noticeTable td:nth-child(2)::before {
    content: ":압정:"; 
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2em;
    margin-right: 10px;
  } */
  /* 새 공지 표시 */
  .newBadge {
    display: inline-block;
    background-color: #FF4D4F;
    color: white;
    padding: 3px 8px;
    font-size: 0.8em;
    border-radius: 50%;
    margin-left: 10px;
  }
  .noData {
    text-align: center;
    padding: 20px;
    color: #888;
  }
  /* 페이지네이션 스타일 */
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .paginationList {
    list-style: none;
    display: flex;
    padding: 0;
  }
  .paginationButton {
    background-color: #F4F4F4;
    border: 1px solid #ddd;
    padding: 10px 15px;
    margin: 0 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .paginationButton:hover {
    background-color: #ddd;
  }
  .active .paginationButton {
    background-color: #007BFF;
    color: white;
    cursor: default;
  }
  .paginationButton:disabled {
    background-color: #eee;
    cursor: not-allowed;
  }

  `;

export default NoticeStyled;