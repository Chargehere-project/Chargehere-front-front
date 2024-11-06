import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaRegStar, FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import style from './ReviewWrite.module.css';

const StarSection = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

// Styled component에서 isFilled를 직접 사용하지 않도록 필터링
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
    const { productId } = router.query;
    const [rating, setRating] = useState<number>(0);
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    const handleStarClick = (value: number) => {
        setRating(value);
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
        if (!productId) {
            alert("상품 ID를 찾을 수 없습니다.");
            return;
        }

        const formData = new FormData();
        formData.append('productId', productId.toString());
        formData.append('rating', rating.toString());
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('/api/reviews', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('리뷰가 성공적으로 등록되었습니다.');
            router.push('/mall/review');
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
                            onClick={() => handleStarClick(star)}
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