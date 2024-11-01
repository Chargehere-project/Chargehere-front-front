import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from '@/styles/admin/BannerSettings.module.css';

const BannerSettings: React.FC = () => {
    const defaultBanners = ['/colla.png', '/game.png', '/style.png']; // 기본 배너 이미지 경로 설정
    const [bannerPreviews, setBannerPreviews] = useState<string[]>(defaultBanners);
    const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null, null, null]);
    const [selectedBannerIndex, setSelectedBannerIndex] = useState<number>(0); // 선택된 배너 인덱스 상태

    // 로컬 스토리지에서 배너 데이터를 가져오는 함수
    React.useEffect(() => {
        const storedBanners = JSON.parse(localStorage.getItem('banners') || '[]');
        if (storedBanners.length === 3) {
            setBannerPreviews(storedBanners);
        }
    }, []);

    // 셀렉트 박스에서 배너 선택 시
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBannerIndex(Number(event.target.value));
    };

    // 배너 파일 변경 핸들러
    const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const localPreviewUrl = URL.createObjectURL(file);
            const newPreviews = [...bannerPreviews];
            const newFiles = [...selectedFiles];
            newPreviews[selectedBannerIndex] = localPreviewUrl;
            newFiles[selectedBannerIndex] = file;

            setBannerPreviews(newPreviews);
            setSelectedFiles(newFiles);
        }
    };

    // 배너 업로드 버튼 클릭 시
    const handleBannerUpload = async () => {
        const file = selectedFiles[selectedBannerIndex];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('/api/admin/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const newPreviews = [...bannerPreviews];
                newPreviews[selectedBannerIndex] = response.data.fileUrl;
                setBannerPreviews(newPreviews);

                // 로컬 스토리지에 업데이트된 배너 배열 저장
                localStorage.setItem('banners', JSON.stringify(newPreviews));
                alert(`배너 ${selectedBannerIndex + 1}이 성공적으로 변경되었습니다.`);
            } catch (error) {
                console.error(`배너 ${selectedBannerIndex + 1} 업로드 실패:`, error);
                alert(`배너 ${selectedBannerIndex + 1} 업로드에 실패했습니다.`);
            }
        }
    };

    // 배너 삭제 핸들러
    const handleDeleteBanner = () => {
        const newPreviews = [...bannerPreviews];
        const newFiles = [...selectedFiles];
        newPreviews[selectedBannerIndex] = defaultBanners[selectedBannerIndex]; // 기본 배너 이미지로 설정
        newFiles[selectedBannerIndex] = null;

        setBannerPreviews(newPreviews);
        setSelectedFiles(newFiles);

        // 로컬 스토리지에 업데이트
        localStorage.setItem('banners', JSON.stringify(newPreviews));
        alert(`배너 ${selectedBannerIndex + 1}이 기본 이미지로 돌아갔습니다.`);
    };

    return (
        <div className={styles.container}>
            <label htmlFor="banner-select">배너 선택:</label>
            <select
                style={{ marginBottom: '20px' }}
                id="banner-select"
                value={selectedBannerIndex}
                onChange={handleSelectChange}
                className={styles.selectBox}>
                <option value={0}>배너 1</option>
                <option value={1}>배너 2</option>
                <option value={2}>배너 3</option>
            </select>

            <div className={styles.bannerSection}>
                {bannerPreviews[selectedBannerIndex] && (
                    <div className={styles.preview}>
                        <Image
                            src={bannerPreviews[selectedBannerIndex]}
                            alt={`배너 ${selectedBannerIndex + 1} 미리보기`}
                            width={600}
                            height={300}
                        />
                    </div>
                )}
                <input type="file" onChange={handleBannerChange} />
                <div className={styles.buttonGroup}>
                    <button
                        onClick={handleBannerUpload}
                        disabled={!selectedFiles[selectedBannerIndex]}
                        className={styles.uploadButton}>
                        업로드
                    </button>
                    <button onClick={handleDeleteBanner} className={styles.deleteButton}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BannerSettings;
