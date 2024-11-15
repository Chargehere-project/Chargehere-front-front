import { ArrowUpOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import ButtonStyled from './styled';

interface UserSession {
  UserID: number;
}

const Buttons = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 로그인 여부를 확인하는 함수
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 토큰 디코드하여 userId 가져오기
          const decoded: any = jwtDecode(token);
          const userId = decoded.UserID;

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
            { userId }, // userId를 request body에 포함
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.result) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying user session', error);
          setIsLoggedIn(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUserSession();
  }, []);

  // QR 버튼 클릭 핸들러
  const handleQRButtonClick = () => {
    if (isLoggedIn) {
      router.push('/charging');
    } else {
      setIsModalOpen(true); // 로그인 필요 모달 열기
    }
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    router.push('/mall/login'); // 로그인 페이지로 이동
  };

  const handleModalCancel = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <ButtonStyled>
      <Button
        type="primary"
        shape="circle"
        icon={<QrcodeOutlined style={{ fontSize: '25px' }} />}
        className="qrButton"
        onClick={handleQRButtonClick} // 모달 표시
        loading={isLoading}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<ArrowUpOutlined style={{ fontSize: '20px' }} />}
        className="scrollTopButton"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
      <Modal
        title="로그인 필요"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="로그인하러 가기"
        cancelText="취소"
      >
        로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?
      </Modal>
    </ButtonStyled>
  );
};

export default Buttons;
