import { ArrowUpOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import ButtonStyled from './styled';

const Buttons = () => {
  const router = useRouter();

  return (
    <ButtonStyled>
      <Button
        type="primary"
        shape="circle"
        icon={<QrcodeOutlined style={{ fontSize: '25px' }} />}
        className="qrButton"
        onClick={() => router.push('/charging')}
      />
      <Button
        type="primary"
        shape="circle"
        icon={<ArrowUpOutlined style={{ fontSize: '20px' }} />}
        className="scrollTopButton"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </ButtonStyled>
  );
};

export default Buttons;
