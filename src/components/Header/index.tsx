import Image from 'next/image';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
const Header = () => {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Image src="/main.png" alt="logo" width={100} height={50} />
            <div>
                <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} />
                <ShopOutlined style={{ fontSize: '30px' }} />
            </div>
        </header>
    );
};
export default Header;
