import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.pathname.startsWith("/mall");

  return (
    <>
      {path ? "여기에 헤더를 추가하세요~~" : <Header />}
      <Component {...pageProps} />;
      <Footer />
    </>
  );
}
