import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Modal from 'react-modal';
import { MdEdit, MdDelete } from 'react-icons/md';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import moment from 'moment-timezone';
import 'react-quill/dist/quill.snow.css';
import styles from '@/styles/admin/Table.module.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const ITEMS_PER_PAGE = 10;

const NoticeManagement: React.FC = () => {
    const [notices, setNotices] = useState([]);
    const [totalNotices, setTotalNotices] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });
    const [editNotice, setEditNotice] = useState<any>({});
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTotalNotices = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices/count`);
                setTotalNotices(response.data.count);
            } catch (error) {
                console.error('공지사항 총 개수 가져오기 실패:', error);
            }
        };
        fetchTotalNotices();
    }, []);

    const fetchNotices = async (page = 1) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices`, {
                params: { page, limit: ITEMS_PER_PAGE },
            });
            setNotices(response.data.notices);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error('공지사항 목록 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        fetchNotices(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const renderPaginationButtons = () => {
        let pages = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) pages.push(<span key="prev-dots">...</span>);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? styles.activePage : ''}
                    style={{
                        padding: '8px 12px',
                        margin: '0 5px',
                        backgroundColor: currentPage === i ? '#1890ff' : 'transparent',
                        color: currentPage === i ? 'white' : '#000',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        lineHeight: '24px',
                    }}>
                    {i}
                </button>
            );
        }
        if (endPage < totalPages) pages.push(<span key="next-dots">...</span>);

        return pages;
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setNewNotice({ title: '', content: '' });
    };

    const openEditModal = (notice: any) => {
        setEditNotice(notice);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditNotice({ title: '', content: '' });
    };

    const handleSaveNotice = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices`, {
                title: newNotice.title,
                content: newNotice.content,
                postDate: moment().format('YYYY-MM-DD'),
            });
            alert('공지사항이 등록되었습니다.');
            closeModal();
            setTotalNotices((prev) => prev + 1); // 공지사항 총 개수 증가
            fetchNotices(1); // 새로고침하여 목록 업데이트
        } catch (error) {
            console.error('공지사항 등록 실패:', error);
            alert('공지사항 등록에 실패했습니다.');
        }
    };

    const handleEditNotice = async () => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices/${editNotice.NoticeID}`, {
                title: editNotice.Title,
                content: editNotice.Content,
                postDate: moment().format('YYYY-MM-DD'),
            });
            alert('공지사항이 수정되었습니다.');
            closeEditModal();
            fetchNotices(currentPage); // 새로고침하여 목록 업데이트
        } catch (error) {
            console.error('공지사항 수정 실패:', error);
            alert('공지사항 수정에 실패했습니다.');
        }
    };

    const handleDeleteNotice = async (noticeId: number) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/notices/${noticeId}`);
            alert('공지사항이 삭제되었습니다.');
            setTotalNotices((prev) => prev - 1); // 공지사항 총 개수 감소
            fetchNotices(currentPage); // 새로고침하여 목록 업데이트
        } catch (error) {
            console.error('공지사항 삭제 실패:', error);
            alert('공지사항 삭제에 실패했습니다.');
        }
    };

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
        ],
        clipboard: { matchVisual: false },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ];

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>게시일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((notice, index) => (
                        <tr key={notice.NoticeID}>
                            <td>{totalNotices - (currentPage - 1) * ITEMS_PER_PAGE - index}</td>
                            <td>{notice.Title}</td>
                            <td>{notice.Content.substring(0, 20)}...</td>
                            <td>{moment(notice.PostDate).format('YYYY.MM.DD')}</td>
                            <td>
                                <MdEdit
                                    style={{ cursor: 'pointer' }}
                                    className={styles.icon}
                                    onClick={() => openEditModal(notice)}
                                />
                                <MdDelete
                                    style={{ cursor: 'pointer' }}
                                    className={styles.icon}
                                    onClick={() => handleDeleteNotice(notice.NoticeID)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
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

            <div style={{ textAlign: 'right', marginTop: '-50px' }}>
                <button
                    onClick={openModal}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}>
                    공지 등록
                </button>
            </div>

            {/* 공지 등록 모달 */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>공지 등록</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '15px', width: '70%' }}>
                        <label>제목:</label>
                        <input
                            type="text"
                            value={newNotice.title}
                            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
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
                        <label>내용:</label>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            value={newNotice.content}
                            onChange={(value) => setNewNotice({ ...newNotice, content: value })}
                            style={{ height: '200px', marginBottom: '100px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                            onClick={handleSaveNotice}
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

            {/* 공지 수정 모달 */}
            <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>공지 수정</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '15px', width: '70%' }}>
                        <label>제목:</label>
                        <input
                            type="text"
                            value={editNotice.Title}
                            onChange={(e) => setEditNotice({ ...editNotice, Title: e.target.value })}
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
                        <label>내용:</label>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            value={editNotice.Content}
                            onChange={(value) => setEditNotice({ ...editNotice, Content: value })}
                            style={{ height: '200px', marginBottom: '100px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button
                            onClick={handleEditNotice}
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
                            onClick={closeEditModal}
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
        </div>
    );
};

export default NoticeManagement;
