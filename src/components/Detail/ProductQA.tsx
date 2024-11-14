import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface QA {
    QnAID: number;  // QID 대신 QnAID
    ProductID: number;
    UserID: number;
    Title: string;   // 추가
    Content: string; // Question 대신 Content
    Status: string;  // 추가
    CreatedAt: string; // Date 대신 CreatedAt
    QnAReplies: { 
        ReplyContent: string;
        CreatedAt: string;
    }[];
}
interface ProductQAProps {
    productId: number;
}

const ProductQA: React.FC<ProductQAProps> = ({ productId }) => {
    const router = useRouter();
    const [selectedQaId, setSelectedQaId] = useState<number | null>(null);
    const [qas, setQAs] = useState<QA[]>([]);

    useEffect(() => {
        const fetchQAs = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/qas/product/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.result) {
                    setQAs(response.data.data);
                    console.log('받아온 QA 데이터:', response.data.data); // 데이터 확인용
                }
            } catch (error) {
                console.error('Q&A 목록을 불러오는데 실패했습니다:', error);
            }
        };

        if (productId) {
            fetchQAs();
        }
    }, [productId]);

    const handleItemClick = async (qaId: number, userId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const decoded: any = jwtDecode(token);
            const currentUserId = decoded.UserID;

            if (currentUserId !== userId) {
                alert('본인이 작성한 글만 확인할 수 있습니다.');
                return;
            }

            if (selectedQaId === qaId) {
                setSelectedQaId(null);
                return;
            }

            setSelectedQaId(qaId);
        } catch (err) {
            console.error('문의 내용을 불러오는데 실패했습니다.');
        }
    };

    const handleWriteClick = () => {
        router.push(`/mall/product/${productId}/qa/write`); // productId 사용
    };

    return (
        <div style={styles.container}>
            {qas && qas.length > 0 ? (
                <div style={styles.qaList}>
                    {qas.map((item) => {
                        const token = localStorage.getItem('token');
                        const decoded: any = token ? jwtDecode(token) : null;
                        const currentUserId = decoded ? decoded.UserID : null;
                        const isMyInquiry = currentUserId === item.UserID;
                        const isSelected = selectedQaId === item.QnAID;  // QID -> QnAID
    
                        return (
                            <div key={`qa-container-${item.QnAID}`}>
                                <div
                                    key={`qa-item-${item.QnAID}`}
                                    style={{
                                        ...styles.qaItem,
                                        cursor: isMyInquiry ? 'pointer' : 'default',
                                        backgroundColor: isMyInquiry ? (isSelected ? '#f0f7ff' : '#fff') : '#f5f5f5',
                                        opacity: isMyInquiry ? 1 : 0.7,
                                    }}
                                    onClick={() => handleItemClick(item.QnAID, item.UserID)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3>{item.Title}</h3>  {/* Title 표시 */}
                                        {!isMyInquiry && (
                                            <span style={styles.otherUserBadge}>
                                                다른 사용자의 글
                                            </span>
                                        )}
                                    </div>
                                    <p>{new Date(item.CreatedAt).toLocaleDateString()}</p>
                                </div>
                                {isSelected && (
                                    <div
                                        key={`qa-answer-${item.QnAID}`}
                                        style={styles.answerSection}
                                        className="reply-animation"
                                    >
                                        <div style={styles.answerContent}>
                                            <h4 style={styles.answerContentTitle}>문의 내용</h4>
                                            <p>{item.Content}</p>  {/* Question -> Content */}
                                            <div style={styles.answerSeparator} />
                                            {item.QnAReplies && item.QnAReplies.length > 0 ? (
                                                item.QnAReplies.map((reply, index) => (
                                                    <div 
                                                        key={`reply-${item.QnAID}-${index}`} 
                                                        style={styles.answerContainer}
                                                    >
                                                        <h4 style={styles.answerTitle}>답변</h4>
                                                        <p>{reply.ReplyContent}</p>
                                                        <small style={styles.replyDate}>
                                                            {new Date(reply.CreatedAt).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={styles.noAnswer}>아직 답변이 없습니다.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={styles.qaList}>
                    <p style={styles.placeholderContent}>작성된 문의가 없습니다.</p>
                </div>
            )}
            <button onClick={handleWriteClick} style={styles.writeButton}>
                문의하기
            </button>
        </div>
    );
};

// CS 스타일과 동일한 스타일 적용
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '20px',
        paddingBottom: '80px', // 하단 여백 추가
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        position: 'relative',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center' as 'center',
        marginBottom: '20px',
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

export default ProductQA;
