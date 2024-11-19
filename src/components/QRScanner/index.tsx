import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, Modal, message } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const QRScanner = () => {
    const [isQRModalVisible, setIsQRModalVisible] = useState(false);
    const router = useRouter();
    const qrCodeScannerRef = useRef<Html5Qrcode | null>(null);
    const [isAnimationReady, setIsAnimationReady] = useState(false); // 애니메이션 상태

    const startScanner = async () => {
        try {
            const readerElementId = "reader";

            const readerElement = document.getElementById(readerElementId);
            if (!readerElement) {
                throw new Error(`HTML Element with id=${readerElementId} not found`);
            }

            const html5QrCode = new Html5Qrcode(readerElementId);
            qrCodeScannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText) => {
                    await html5QrCode.stop();
                    qrCodeScannerRef.current = null;
                    message.success('충전기 인증 완료');
                    setIsQRModalVisible(false);
                    router.push('/charging/complete');
                },
                (error) => {
                    console.warn("QR 코드 인식 실패:", error);
                }
            );
        } catch (err) {
            if (err instanceof Error) {
                console.error("QR 스캐너 시작 오류:", err.message);
                message.error(`QR 스캐너 초기화 실패: ${err.message}`);
            } else {
                console.error("QR 스캐너 시작 오류:", err);
                message.error("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    useEffect(() => {
        setTimeout(() => setIsAnimationReady(true), 300);

        if (isQRModalVisible) {
            setTimeout(startScanner, 300);
        }

        return () => {
            if (qrCodeScannerRef.current) {
                qrCodeScannerRef.current.stop().catch(console.error);
                qrCodeScannerRef.current = null;
            }
        };
    }, [isQRModalVisible]);

    return (
        <div 
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                backgroundImage: 'url("/intro.jpg")', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <h1
                style={{
                    position: 'relative',
                    zIndex: '10',
                    fontSize: '3rem',
                    marginBottom: '20px',
                    opacity: isAnimationReady ? 1 : 0,
                    transition: 'opacity 2s',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                빠르게 충전하고 싶을 때, ChargeHere
            </h1>
            <Button
                type="primary"
                icon={<ScanOutlined />}
                onClick={() => setIsQRModalVisible(true)}
                size="large"
                style={{
                    height: '50px',
                    width: '200px',
                    fontSize: '16px',
                    animation: 'fadeInButton 2.5s forwards',
                }}
            >
                QR 스캔으로 충전하기
            </Button>

            <Modal
                title="충전기 QR 코드 스캔"
                open={isQRModalVisible}
                onCancel={() => setIsQRModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <div style={{ padding: '20px' }}>
                    <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                        충전기에 부착된 QR 코드를 스캔해주세요
                    </p>
                    <div
                        id="reader"
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            margin: '0 auto',
                        }}
                    ></div>
                </div>
            </Modal>
        </div>
    );
};

export default QRScanner;