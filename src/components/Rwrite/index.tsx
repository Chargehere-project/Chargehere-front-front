import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaRegStar, FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import style from './ReviewWrite.module.css';
import { jwtDecode } from 'jwt-decode';  // jwtDecode 추가

const StarSection = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const StarIcon = styled.span<{ $isFilled: boolean }>`
    color: ${(props) => (props.$isFilled ? '#FEE500' : '#ccc')};
    font-size: 30px;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: #FEE500;
    }
`;

function Rwrite() {
    const router = useRouter();
    const { productId, orderId } = router.query;
    const [rating, setRating] = useState<number>(0);
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    // 별점 클릭 핸들러 함수 추가
    const handleClick = (value: number) => {
        setRating(value);
    };

    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.UserID;
        } catch (error) {
            console.error('토큰 디코드 에러:', error);
            return null;
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = getUserId();
        
        if (!productId || !orderId || !userId) {
            alert("필요한 정보가 부족합니다.");
            return;
        }
    
        try {
            // FormData 대신 일반 객체 사용
            const reviewData = {
                OrderListID: orderId,
                UserID: userId,
                ProductID: productId,
                Rating: rating,
                Content: content,
            };
    
            console.log('전송할 데이터:', reviewData);  // 데이터 확인용 로그
    
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, 
                reviewData,  // FormData 대신 일반 객체 사용
                {
                    headers: { 
                        'Content-Type': 'application/json',  // multipart/form-data 대신 application/json 사용
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                }
            );
    
            if (response.data.result) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                router.push('/mall/profile');
            }
        } catch (error) {
            console.error('리뷰 등록 실패:', error);
            alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={style.reviewContainer}>
            <h2 className={style.title}>리뷰 작성</h2>
            <form onSubmit={handleSubmit} className={style.reviewForm}>
                <div className={style.label}>평점</div>
                <StarSection>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            $isFilled={star <= rating}
                            onClick={() => handleClick(star)}  // handleStarClick을 handleClick으로 변경
                        >
                            {star <= rating ? <FaStar /> : <FaRegStar />}
                        </StarIcon>
                    ))}
                    <span>{rating} / 5</span>
                </StarSection>

                <label className={style.label}>리뷰 내용</label>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="제품에 대한 솔직한 의견을 남겨주세요."
                    className={style.textarea}
                    rows={5}
                />

                <label className={style.label}>이미지 업로드</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className={style.fileInput} />

                <button type="submit" className={style.submitButton}>리뷰 등록</button>
            </form>
        </div>
    );
}

export default Rwrite;