import Image from 'next/image';
import { UserOutlined, ShopOutlined } from '@ant-design/icons';
const Header = () => {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <Image src="/main.jpg" alt="logo" width={150} height={100} />
            <div>
                <UserOutlined style={{ fontSize: '30px', marginRight: '20px' }} />
                <ShopOutlined style={{ fontSize: '30px' }} />
            </div>
        </header>
    );
};
export default Header;
