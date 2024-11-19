import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

interface Inquiry {
    InquiryID: number;
    UserID: number;
    Title: string;
    Content: string;
    CreatedAt: string;
    InquiryReplies: { ReplyID: number; ReplyContent: string; CreatedAt: string }[];
}

function InquiryDetail() {
    const router = useRouter();
    const { inquiryId } = router.query;
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('로그인이 필요합니다.');
                    return;
                }

                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.result) {
                    // 필터링 제거하고 모든 글 표시
                    setInquiries(response.data.data);
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError('문의 목록을 불러오는데 실패했습니다.');
                }
            }
        };

        fetchInquiries();
    }, []);

    useEffect(() => {
        const fetchInquiry = async () => {
            if (!inquiryId) return;

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiry/${inquiryId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.data.result) {
                    setInquiry(response.data.data);
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    if (err.response && err.response.status === 403) {
                        setError('해당 문의를 볼 수 있는 권한이 없습니다.');
                    } else {
                        setError('서버 오류가 발생했습니다.');
                    }
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            }
        };

        fetchInquiry();
    }, [inquiryId]);

    const handleWriteClick = () => {
        router.push('/mall/cs/cwrite');
    };

    const handleItemClick = async (itemId: number, itemUserId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const decoded: any = jwtDecode(token);
            const currentUserId = decoded.UserID;

            if (currentUserId !== itemUserId) {
                alert('본인이 작성한 글만 확인할 수 있습니다.');
                return;
            }

            if (selectedInquiryId === itemId) {
                // 이미 선택된 글을 다시 클릭하면 닫기
                setSelectedInquiryId(null);
                setInquiry(null);
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/inquiry/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.result) {
                setInquiry(response.data.data);
                setSelectedInquiryId(itemId);
            }
        } catch (err) {
            setError('문의 내용을 불러오는데 실패했습니다.');
        }
    };
    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>CS</h1>
            {inquiries && inquiries.length > 0 ? (
                <div style={styles.inquiriesList}>
                    {inquiries.map((item) => {
                        const token = localStorage.getItem('token');
                        const decoded: any = token ? jwtDecode(token) : null;
                        const currentUserId = decoded ? decoded.UserID : null;
                        const isMyInquiry = currentUserId === item.UserID;
                        const isSelected = selectedInquiryId === item.InquiryID;

                        return (
                            <div key={item.InquiryID}>
                                <div
                                    style={{
                                        ...styles.inquiryItem,
                                        cursor: isMyInquiry ? 'pointer' : 'default',
                                        backgroundColor: isMyInquiry ? (isSelected ? '#f0f7ff' : '#fff') : '#f5f5f5',
                                        opacity: isMyInquiry ? 1 : 0.7,
                                    }}
                                    onClick={() => handleItemClick(item.InquiryID, item.UserID)}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <h3>{item.Title}</h3>
                                        {!isMyInquiry && <span style={styles.otherUserBadge}>다른 사용자의 글</span>}
                                    </div>
                                    <p>{new Date(item.CreatedAt).toLocaleDateString()}</p>
                                </div>
                                {isSelected && inquiry && inquiry.InquiryID === item.InquiryID && (
                                    <div style={styles.replySection} className="reply-animation">
                                        <div style={styles.replyContent}>
                                            <h4 style={styles.replyContentTitle}>문의 내용</h4>
                                            <p>{inquiry.Content}</p>
                                            <div style={styles.replySeparator} />
                                            {inquiry.InquiryReplies && inquiry.InquiryReplies.length > 0 ? (
                                                inquiry.InquiryReplies.map((reply) => (
                                                    <div key={reply.ReplyID} style={styles.replyContainer}>
                                                        <h4 style={styles.replyTitle}>답변</h4>
                                                        <p>{reply.ReplyContent}</p>
                                                        <small style={styles.replyDate}>
                                                            {new Date(reply.CreatedAt).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={styles.noReply}>아직 답변이 없습니다.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={styles.inquiriesList}>
                    <p style={styles.placeholderContent}>작성된 문의가 없습니다.</p>
                </div>
            )}
            <button onClick={handleWriteClick} style={styles.writeButton}>
                문의하기
            </button>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '20px 60px',
        paddingBottom: '80px',
        borderRadius: '8px',
        position: 'relative',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#555',
        padding: '40px 0',
        textAlign: 'left' as 'left'
    },
    inquiriesList: {
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    
    inquiryItem: {
        padding: '15px',
        borderBottom: '1px solid #ddd',
        transition: 'all 0.2s ease',
        backgroundColor: '#fff',
    },
    writeButton: {
        position: 'absolute',
        right: '20px',
        bottom: '20px', // bottom 값 유지
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px',
        zIndex: 10, // 다른 요소들 위에 표시되도록
    },
    placeholderContent: {
        color: '#888',
        fontSize: '16px',
        textAlign: 'center' as 'center',
        marginTop: '20px',
    },
    // 새로운 스타일
    replySection: {
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
    },
    replyContent: {
        padding: '20px',
        margin: '0 20px',
    },
    replyContentTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333',
    },
    replySeparator: {
        height: '1px',
        backgroundColor: '#ddd',
        margin: '20px 0',
    },
    replyContainer: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    replyTitle: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#0070f3',
        marginBottom: '8px',
    },
    inquiryContent: {
        fontSize: '16px',
        marginBottom: '20px',
        color: '#333',
    },
    replyDate: {
        display: 'block',
        marginTop: '8px',
        color: '#666',
    },
    noReply: {
        textAlign: 'center' as 'center',
        color: '#666',
        padding: '20px 0',
    },
    otherUserBadge: {
        fontSize: '12px',
        color: '#666',
        backgroundColor: '#eee',
        padding: '3px 8px',
        borderRadius: '4px',
    },
};

export default InquiryDetail;
