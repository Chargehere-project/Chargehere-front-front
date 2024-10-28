import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter(); // router 사용
  const path = router.pathname.startsWith("/mall"); // url 시작이 mall인지 확인 후에 있으면 true 없으면 false 반환

  return (
    <>
      {path ? "여기에 헤더를 추가하세요~~" : <Header />}
      <Component {...pageProps} />;
      <Footer />
    </>
  );
}
