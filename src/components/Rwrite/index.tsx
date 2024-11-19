import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Rate, Button } from 'antd';
import styled from 'styled-components';
import RwriteStyled from './styled';
import { jwtDecode } from 'jwt-decode'; // jwtDecode 추가

const PreviewContainer = styled.div`
    width: 50%; // 이미지 미리보기 크기 설정
    margin-top: 10px;
    display: flex;
    justify-content: center; // 중앙 정렬
    align-items: center; // 중앙 정렬
    img {
        width: 100%;
        height: auto;
        display: block;
    }
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const FileInputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
`;

const FileInput = styled.input`
    cursor: pointer; // 파일 선택 시 마우스 포인터 변경
`;

function Rwrite() {
    const router = useRouter();
    const { orderListId, productId } = router.query; // 동적 파라미터를 받아옵니다

    const [rating, setRating] = useState<number>(0); // 별점 상태
    const [content, setContent] = useState<string>(''); // 리뷰 내용
    const [image, setImage] = useState<File | null>(null); // 이미지 상태
    const [previewImage, setPreviewImage] = useState<string | null>(null); // 미리보기 이미지 상태
    const [fileInputKey, setFileInputKey] = useState<number>(0); // 파일 업로드 input의 key 값으로 상태 변경


    useEffect(() => {
        if (orderListId && productId) {
        }
    }, [router.query]);

    // 별점 클릭 핸들러 함수
    const handleRatingChange = (value: number) => {
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
            const file = e.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string); // 이미지 미리보기
            };
            reader.readAsDataURL(file);
        }
    };

    // 이미지 미리보기 취소 및 파일 초기화
    const handleImageCancel = () => {
        setImage(null);
        setPreviewImage(null); // 이미지 취소 시 미리보기 이미지 제거
        setFileInputKey((prevKey) => prevKey + 1); // 파일 input의 key를 변경하여 초기화
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const userId = getUserId();

    
        if (!orderListId || !productId || !userId) {
            alert('필요한 정보가 부족합니다.');
            return;
        }
    
        try {
            const reviewData = {
                userId,
                productId,
                orderId: orderListId,  // orderListId를 orderId로 전달
                rating,
                content,
            };
    
    
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviewwrite`, 
                reviewData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
    
            if (response.data.result) {
                alert('리뷰가 성공적으로 등록되었습니다.');
                router.push('/mall/profile');
            }
        } catch (error: any) {
            console.error('리뷰 등록 실패:', error.response?.data);
            alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <RwriteStyled>
            <div className= 'reviewContainer'>
            <h2 className= 'Title'>리뷰 작성</h2>
            <form onSubmit={handleSubmit} className= 'reviewForm'>
                <div className= 'label'>평점</div>
                <RatingContainer>
                    <Rate
                        allowHalf={false} // 0.5점 없이 1점씩만 선택 가능하게 설정
                        value={rating}
                        onChange={handleRatingChange}
                    />
                    <span>{rating} / 5</span>
                </RatingContainer>

                <label className= 'label'>리뷰 내용</label>
                <textarea
                    value={content}
                    onChange={handleContentChange}
                    placeholder="제품에 대한 솔직한 의견을 남겨주세요."
                    className= 'textarea'
                    rows={5}
                />

                <label className= 'label'>이미지 업로드</label>
                <FileInputContainer>
                    <FileInput
                        key={fileInputKey} // key값을 변경하여 초기화 효과를 줌
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className= 'fileInput'
                    />
                    {previewImage && <Button onClick={handleImageCancel}>이미지 취소</Button>}
                </FileInputContainer>

                {previewImage && (
                    <PreviewContainer>
                        <img src={previewImage} alt="Preview" className= 'previewImage' />
                    </PreviewContainer>
                )}

                <button onClick={handleSubmit} className= 'submitButton'>
                    리뷰 등록
                </button>
            </form>
        </div>

        </RwriteStyled>
        
    );
}

export default Rwrite;
