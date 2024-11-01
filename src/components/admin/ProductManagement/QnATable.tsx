import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdEdit } from 'react-icons/md';
import Modal from 'react-modal';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import styles from '@/styles/admin/ProductManagement.module.css';
import QnASearch from './QnASearch';

const ITEMS_PER_PAGE = 10;
const VISIBLE_PAGE_RANGE = 2;

const QnATable: React.FC = () => {
    const [qnas, setQnAs] = useState([]);
    const [filteredQnAs, setFilteredQnAs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQnA, setSelectedQnA] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchQnAs(currentPage);
    }, [currentPage]);

    const fetchQnAs = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/qnas`, {
                params: {
                    page,
                    limit: ITEMS_PER_PAGE,
                },
            });
            setQnAs(response.data.qna);
            setFilteredQnAs(response.data.qna);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('QnA 목록 가져오기 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };


   const handleSearchResults = (searchParams) => {
       console.log('Search parameters:', searchParams); // 검색 파라미터 로그

       // 조건이 없으면 전체 목록을 보여줌
       if (!searchParams.query && !searchParams.status && !searchParams.startDate && !searchParams.endDate) {
           setFilteredQnAs(qnas);
           return;
       }

       const filtered = qnas.filter((qna) => {
           // 검색 조건에 따른 필터링
           const queryMatches = searchParams.query
               ? (qna.UserID && qna.UserID.toString().includes(searchParams.query)) ||
                 (qna.Title && qna.Title.toLowerCase().includes(searchParams.query.toLowerCase())) ||
                 (qna.Content && qna.Content.toLowerCase().includes(searchParams.query.toLowerCase()))
               : true;

           const statusMatches = searchParams.status ? qna.Status === searchParams.status : true;

           // 기간 필터링
           const dateMatches =
               searchParams.startDate && searchParams.endDate
                   ? new Date(qna.CreatedAt) >= new Date(searchParams.startDate) &&
                     new Date(qna.CreatedAt) <= new Date(searchParams.endDate)
                   : true;

           return queryMatches && statusMatches && dateMatches;
       });

       setFilteredQnAs(filtered);
   };


    const handleReset = () => {
        setFilteredQnAs(qnas);
    };

    const getStatusInKorean = (status: string) => {
        switch (status) {
            case 'Pending':
                return <span style={{ color: 'orange' }}>대기중</span>;
            case 'Answered':
                return <span style={{ color: 'green' }}>답변 완료</span>;
            case 'Closed':
                return <span style={{ color: 'gray' }}>종료됨</span>;
            default:
                return status;
        }
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handleOpenModal = async (qna: any) => {
        setSelectedQnA(qna);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/qnas/${qna.QnAID}/replies`);
            if (response.data.reply) {
                setReplyContent(response.data.reply.ReplyContent);
            }
        } catch (error) {
            console.error('기존 답변 불러오기 실패:', error);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQnA(null);
        setReplyContent('');
    };

    const handleSaveReply = async () => {
        if (!replyContent || replyContent.trim() === '') {
            console.error('답변 내용이 비어 있습니다.');
            return;
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/qnas/${selectedQnA.QnAID}/replies`, {
                ReplyContent: replyContent,
            });

            const updatedQnAs = qnas.map((qna) => {
                if (qna.QnAID === selectedQnA.QnAID) {
                    return { ...qna, Status: 'Answered' };
                }
                return qna;
            });

            setQnAs(updatedQnAs);
            setFilteredQnAs(updatedQnAs);
            closeModal();
        } catch (error) {
            console.error('답변 저장 실패:', error);
        }
    };

    const renderPaginationButtons = () => {
        const pages = [...Array(totalPages)].map((_, index) => index + 1);
        return pages.map((page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? styles.activePage : ''}
                style={{
                    padding: '8px 12px',
                    margin: '0 5px',
                    backgroundColor: currentPage === page ? '#1890ff' : 'transparent',
                    color: currentPage === page ? 'white' : '#000',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    lineHeight: '24px',
                }}>
                {page}
            </button>
        ));
    };

    const shortenText = (text: string, limit: number) => {
        if (text.length > limit) {
            return `${text.slice(0, limit)}...`;
        }
        return text;
    };



    return (
        <div className={styles.container}>
            <QnASearch onSearch={handleSearchResults} onReset={handleReset} />

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>QnA ID</th>
                                <th>회원 ID</th>
                                <th>상품 ID</th>
                                <th>QnA 제목</th>
                                <th>QnA 내용</th>
                                <th>상태</th>
                                <th>작성 시간</th>
                                <th>답변하기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(filteredQnAs) && filteredQnAs.length > 0 ? (
                                filteredQnAs.map((qna: any) => (
                                    <tr key={qna.QnAID}>
                                        <td>{qna.QnAID}</td>
                                        <td>{qna.UserID}</td>
                                        <td>{qna.ProductID}</td>
                                        <td>{shortenText(qna.Title, 20)}</td> {/* 제목을 20자로 줄임 */}
                                        <td>{shortenText(qna.Content, 30)}</td> {/* 내용을 30자로 줄임 */}
                                        <td>{getStatusInKorean(qna.Status)}</td>
                                        <td>{new Date(qna.CreatedAt).toLocaleString()}</td>
                                        <td>
                                            <MdEdit
                                                onClick={() => handleOpenModal(qna)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center' }}>
                                        문의가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '20px', textAlign: 'center', lineHeight: '24px' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 12px',
                                margin: '0 5px',
                                backgroundColor: 'transparent',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                border: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}>
                            <IoChevronBackOutline size={18} />
                        </button>

                        {renderPaginationButtons()}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 12px',
                                margin: '0 5px',
                                backgroundColor: 'transparent',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                border: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                            }}>
                            <IoChevronForwardOutline size={18} />
                        </button>
                    </div>

                    <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="답변하기">
                        <h2 style={{ textAlign: 'center', margin: '10px 0', marginBottom: '20px' }}>QnA 답변</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div
                                style={{
                                    marginBottom: '15px',
                                    width: '70%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}>
                                <div style={{ width: '35%', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '20%' }}>QnA ID:</label>
                                    <input
                                        type="text"
                                        value={selectedQnA?.QnAID}
                                        readOnly
                                        style={{
                                            width: '60%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>

                                <div style={{ width: '35%', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '20%' }}>회원 ID:</label>
                                    <input
                                        type="text"
                                        value={selectedQnA?.UserID}
                                        readOnly
                                        style={{
                                            width: '60%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>

                                <div style={{ width: '25%', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '40%' }}>상품 ID:</label>
                                    <input
                                        type="text"
                                        value={selectedQnA?.ProductID}
                                        readOnly
                                        style={{
                                            width: '60%',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px', width: '70%' }}>
                                <label>QnA 날짜:</label>
                                <input
                                    type="text"
                                    value={selectedQnA ? new Date(selectedQnA.CreatedAt).toLocaleString() : ''}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        marginBottom: '10px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px', width: '70%' }}>
                                <label>QnA 제목:</label>
                                <textarea
                                    value={selectedQnA?.Title}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        resize: 'none',
                                        marginBottom: '10px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px', width: '70%' }}>
                                <label>QnA 내용:</label>
                                <textarea
                                    value={selectedQnA?.Content}
                                    readOnly
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        resize: 'none',
                                        marginBottom: '10px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '15px', width: '70%' }}>
                                <label>답변 내용:</label>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '80px',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        resize: 'none',
                                        marginBottom: '10px',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={handleSaveReply}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>
                                    저장
                                </button>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>
                                    취소
                                </button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default QnATable;
