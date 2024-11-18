import { ArrowUpOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ButtonStyled from './styled';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Buttons = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 여부를 확인하는 함수
  const checkUserSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.UserID;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.result) {
        setIsLoading(false);
        return true;
      } else {
        localStorage.removeItem('token');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error verifying user session', error);
      localStorage.removeItem('token');
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkUserSession();
  }, [router.asPath]); // 라우터 경로가 변경될 때마다 체크

  // QR 버튼 클릭 핸들러
  const handleQRButtonClick = async () => {
    setIsLoading(true);
    const isAuthenticated = await checkUserSession();
    
    if (isAuthenticated) {
      router.push('/charging');
    } else {
      setIsModalOpen(true);
    }
    setIsLoading(false);
  };

  // 모달 관련 함수
  const handleModalOk = () => {
    setIsModalOpen(false);
    router.push('/mall/login');
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ButtonStyled>
      <Button
        type="primary"
        shape="circle"
        icon={<QrcodeOutlined style={{ fontSize: '25px' }} />}
        className="qrButton"
        onClick={handleQRButtonClick}
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