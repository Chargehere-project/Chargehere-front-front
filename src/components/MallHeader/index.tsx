import Image from 'next/image';
import { UserOutlined, ShoppingOutlined, LoginOutlined, SearchOutlined } from '@ant-design/icons';
const MallHeader = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center' }}>
      {/* 로고 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/main.png" alt="logo" width={100} height={50} />
      </div>
      {/* 아이콘이랑 검색 영역 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 장바구니 */}
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <ShoppingOutlined style={{ fontSize: '30px' }} />
        </div>
        {/* 마이페이지 */}
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <UserOutlined style={{ fontSize: '30px' }} />
        </div>
        {/* 로그인 */}
        <div style={{ textAlign: 'center', marginRight: '20px' }}>
          <LoginOutlined style={{ fontSize: '30px' }} />
        </div>
        {/* 검색 */}
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          <SearchOutlined style={{ fontSize: '30px' }} />
        </div>
      </div>
    </header>
  );
};
export default MallHeader;