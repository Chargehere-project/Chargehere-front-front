import '@/styles/globals.css'; // globals.css 추가
import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import type { AppProps } from 'next/app';
import Footer from '@/components/Footer';
import MallHeader from '@/components/MallHeader';
import { useRouter } from 'next/router';
import Button from '@/components/Button'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [faviconUrl, setFaviconUrl] = useState('/favicon.ico'); // 기본 파비콘 설정

    // 특정 경로에서는 헤더와 푸터를 숨김
    const path =
        router.pathname.startsWith('/mall/login') ||
        router.pathname.startsWith('/mall/signup') ||
        router.pathname.startsWith('/mall/profile/edit') ||
        router.pathname.startsWith('/mall/findpw') ||
        router.pathname.startsWith('/mall/findid');

    const fetchFavicon = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/files/favicon`);
            if (response.data.fileUrl) {
                setFaviconUrl(response.data.fileUrl); // 최신 파비콘 URL로 설정
            }
        } catch (error) {
            console.error('Failed to fetch favicon from S3:', error);
        }
    };

    useEffect(() => {
        fetchFavicon();
    }, []);

    const path2 = router.pathname.startsWith('/order')

    return (
        <div className="app-container">
            <Head>
                <link rel="icon" href={faviconUrl} type="image/x-icon" />
            </Head>
            {path ? null : <MallHeader />}
            <div className="content">
                <Component {...pageProps} />
            </div>
            {path ? null : <Footer />}
            {path2 ? null : <Button  />}
        </div>
    );
}
