import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MallHeader from '@/components/MallHeader';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Menu from '@/components/mall/menu';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter(); // router 사용
    const path = router.pathname.startsWith('/mall'); // url 시작이 mall인지 확인 후에 있으면 true 없으면 false 반환
    
    return (
        <div className="app-container">
            {path ? <MallHeader /> : <Header />}
            <div className="content">
                <Component {...pageProps} />
            </div>
            <Footer />
        </div>
    );
}
