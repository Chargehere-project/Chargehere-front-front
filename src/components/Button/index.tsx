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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const checkUserSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: UserSession = jwtDecode<UserSession>(token);
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

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleQRButtonClick = () => {
    if (isLoggedIn) {
      router.push('/charging');
    } else {
      setIsModalVisible(true);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    router.push('/mall/login');
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <ButtonStyled>
      <Button
        type="primary"
        shape="circle"
        icon={<QrcodeOutlined style={{ fontSize: '25px' }} />}
        className="qrButton"
        onClick={handleQRButtonClick}
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
        visible={isModalVisible}
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
