import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Inquiry {
    InquiryID: number;
    UserID: number;
    Title: string;
    Content: string;
    InquiryReplies: { ReplyID: number; ReplyContent: string; CreatedAt: string }[];
}

function InquiryDetail() {
    const router = useRouter();
    const { inquiryId } = router.query;
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            if (!inquiryId) return;

            try {
                const response = await axios.get(`/api/inquiry/${inquiryId}`);
                setInquiry(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    if (err.response && err.response.status === 403) {
                        setError("해당 문의를 볼 수 있는 권한이 없습니다.");
                    } else {
                        setError("서버 오류가 발생했습니다.");
                    }
                } else {
                    setError("알 수 없는 오류가 발생했습니다.");
                }
            }
        };

        fetchInquiry();
    }, [inquiryId]);

    const handleWriteClick = () => {
        router.push('/mall/cs/cwrite');
    };

    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>고객센터</h1>

            <div style={styles.board}>
                {inquiry ? (
                    <>
                        <h2 style={styles.inquiryTitle}>{inquiry.Title}</h2>
                        <p style={styles.inquiryContent}>{inquiry.Content}</p>
                        {inquiry.InquiryReplies.length > 0 ? (
                            inquiry.InquiryReplies.map((reply) => (
                                <div key={reply.ReplyID} style={styles.replyContainer}>
                                    <h4 style={styles.replyTitle}>답변</h4>
                                    <p>{reply.ReplyContent}</p>
                                </div>
                            ))
                        ) : (
                            <p>아직 답변이 없습니다.</p>
                        )}
                    </>
                ) : (
                    <>
                        <h2 style={styles.inquiryTitle}>아직 작성된 글이 없습니다.</h2>
                        <p style={styles.placeholderContent}>게시글이 등록되면 여기에 표시됩니다.</p>
                    </>
                )}
            </div>

            <button onClick={handleWriteClick} style={styles.writeButton}>글쓰기</button>
        </div>
    );
}

export default InquiryDetail;

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        position: 'relative', // 버튼 위치 조정을 위한 상대 위치
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center' as 'center',
        marginBottom: '20px',
    },
    writeButton: {
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px'
    },
    board: {
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        minHeight: '200px',
    },
    inquiryTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    inquiryContent: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '20px',
    },
    replyContainer: {
        padding: '15px',
        marginTop: '10px',
        borderRadius: '5px',
        backgroundColor: '#f1f1f1',
    },
    replyTitle: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    placeholderContent: {
        color: '#888',
        fontSize: '16px',
        textAlign: 'center' as 'center',
        marginTop: '20px',
    },
};
