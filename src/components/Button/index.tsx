import { ArrowUpOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ButtonStyled from './styled';

const Buttons = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // QR 버튼 클릭 핸들러
  const handleQRButtonClick = () => {
    const token = localStorage.getItem('token');
    console.log(token,'token');
    if (token) { 
      router.push('/charging')      
    } else { 
      setIsModalOpen(true)
    }
  };

  // 모달 관련 함수
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