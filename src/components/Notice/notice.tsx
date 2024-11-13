import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoticeStyled from './styled';
import Pagination from '../Pagenation';

interface Notice {
  NoticeID: number;
  Title: string;
  Content: string;
  PostDate: string;
  isNew: boolean;
}

const NoticePage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [noticesPerPage] = useState<number>(8);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // 컴포넌트 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // 공지사항 가져오기
  useEffect(() => {
    const fetchNotices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/notices`);
        console.log('API 응답:', response.data);
        setNotices(response.data.data);
      } catch (error) {
        console.error('공지사항을 불러오는 중 오류가 발생했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchNotices();
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  // 현재 페이지에 해당하는 공지사항 가져오기
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

  // 페이지 번호 변경 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className='loading'>로딩 중...</div>;
  }

  return (
    <NoticeStyled>
      <div className= 'noticeContainer'>
      <h1 className= 'noticeTitle'>공지사항</h1>
      <table className='noticeTable'>
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
                  {notice.isNew && <span className= 'newBadge'>N</span>}
                </td>
                <td>관리자</td>
                <td>
                  {new Date(notice.PostDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className= 'noData'>
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {notices.length > 0 && (
        <Pagination
          noticesPerPage={noticesPerPage}
          totalNotices={notices.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>

    </NoticeStyled>
    
  );
};

export default NoticePage;