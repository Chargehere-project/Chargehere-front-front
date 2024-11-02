import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const WriteReview = () => {
    const router = useRouter();
    const { orderId, productId } = router.query;  // URL에서 orderId와 productId를 받아옴
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [userId, setUserId] = useState<number | null>(null);

    // 토큰에서 userId 가져오기
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUserId(decoded.UserID);
            } catch (error) {
                console.error('토큰 디코드 에러:', error);
                alert('로그인이 필요합니다.');
                router.push('/login');
            }
        } else {
            alert('로그인이 필요합니다.');
            router.push('/login');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userId || !productId) {
            alert('필요한 정보가 누락되었습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/reviewwrite', {
                userId,       // 회원 ID
                productId,    // 상품 ID
                rating,       // 평점
                content,      // 리뷰 내용
                orderId      // 주문 ID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.result) {
                alert('리뷰가 등록되었습니다.');
                router.push('/profile');
            }
        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>리뷰 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>평점</label>
                    <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        <option value="5">5점</option>
                        <option value="4">4점</option>
                        <option value="3">3점</option>
                        <option value="2">2점</option>
                        <option value="1">1점</option>
                    </select>
                </div>
                <div>
                    <label>리뷰 내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required  // 필수 입력
                        minLength={10}  // 최소 10자
                        maxLength={500}  // 최대 500자
                        rows={5}
                        style={{ width: '100%', marginTop: '10px' }}
                        placeholder="최소 10자 이상 작성해주세요."
                    />
                </div>
                <button 
                    type="submit"
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#7196DB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    리뷰 등록
                </button>
            </form>
        </div>
    );
};

export default WriteReview;