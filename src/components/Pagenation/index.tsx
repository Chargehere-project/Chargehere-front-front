import React from 'react';
import styles from './Pagination.module.css';
interface PaginationProps {
  noticesPerPage: number;
  totalNotices: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}
const Pagination= ({ noticesPerPage, totalNotices, paginate, currentPage }: PaginationProps) => {
  const pageNumbers = [];
  // 총 페이지 수 계산하는거
  for (let i = 1; i <= Math.ceil(totalNotices / noticesPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav className={styles.pagination}>
      <ul className={styles.paginationList}>
        {currentPage > 1 && (
          <li>
            <button onClick={() => paginate(currentPage - 1)} className={styles.paginationButton}>
              &laquo;
            </button>
          </li>
        )}
        {pageNumbers.map((number) => (
          <li key={number} className={number === currentPage ? styles.active : ''}>
            <button onClick={() => paginate(number)} className={styles.paginationButton}>
              {number}
            </button>
          </li>
        ))}
        {currentPage < pageNumbers.length && (
          <li>
            <button onClick={() => paginate(currentPage + 1)} className={styles.paginationButton}>
              &raquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Pagination;