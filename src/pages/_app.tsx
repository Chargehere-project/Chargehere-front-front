import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MallHeader from '@/components/MallHeader';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Menu from '@/components/mall/menu';
import FaviconUpdater from '@/components/admin/FaviconUpdater';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    // url 시작이 /mall 또는 /admin인지 확인
    const isMallPage = router.pathname.startsWith('/mall');
    const isAdminPage = router.pathname.startsWith('/admin');

    return (
        <>
            {/* FaviconUpdater로 모든 페이지에서 파비콘 동기화 */}
            <FaviconUpdater />

            {/* admin 페이지가 아닌 경우에만 헤더와 메뉴를 렌더링 */}
            {!isAdminPage && (
                <>
                    {isMallPage ? <MallHeader /> : <Header />}
                    {isMallPage ? <Menu /> : <div />}
                </>
            )}

            <Component {...pageProps} />

            {/* admin 페이지가 아닌 경우에만 푸터를 렌더링 */}
            {!isAdminPage && <Footer />}
        </>
    );
}
