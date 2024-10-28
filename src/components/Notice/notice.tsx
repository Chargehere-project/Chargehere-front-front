import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Notice.module.css';
import Pagination from '../Pagenation'
interface Notice {
  NoticeID: number;
  Title: string;
  Content: string;
  PostDate: string;
  isNew: boolean;
}
const NoticePage= () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [noticesPerPage] = useState<number>(8);
  // 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('/api/notices');
        setNotices(response.data);
      } catch (error) {
        console.error('공지사항을 불러오는 중 오류가 발생했습니다.', error);
      }
    };
    fetchNotices();
  }, []);
  // 현재 페이지에 해당하는 공지사항 가져오기
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  // 페이지 번호 변경 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className={styles.noticeContainer}>
      <h1 className={styles.noticeTitle}>공지사항</h1>
      <table className={styles.noticeTable}>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>글쓴이</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {currentNotices.length > 0 ? (
            currentNotices.map((notice) => (
              <tr key={notice.NoticeID}>
                <td>{notice.NoticeID}</td>
                <td>
                  {notice.Title}
                  {notice.isNew && <span className={styles.newBadge}>N</span>}
                </td>
                <td>관리자</td>  {/* 작성자는 항상 '관리자'로 표시 */}
                <td>{new Date(notice.PostDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className={styles.noData}>등록된 공지사항이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 페이지네이션 */}
      <Pagination
        noticesPerPage={noticesPerPage}
        totalNotices={notices.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};
export default NoticePage;