import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, Modal, message } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const QRScanner = () => {
    const [isQRModalVisible, setIsQRModalVisible] = useState(false);
    const router = useRouter();
    const qrCodeScannerRef = useRef<Html5Qrcode | null>(null); // Html5Qrcode 인스턴스 관리

    const startScanner = async () => {
        try {
            const readerElementId = "reader";

            // DOM 요소가 존재하는지 확인
            const readerElement = document.getElementById(readerElementId);
            if (!readerElement) {
                throw new Error(`HTML Element with id=${readerElementId} not found`);
            }

            // QR 코드 스캐너 인스턴스 생성 및 시작
            const html5QrCode = new Html5Qrcode(readerElementId);
            qrCodeScannerRef.current = html5QrCode; // 인스턴스를 ref에 저장

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText) => {
                    console.log("QR 코드 인식 성공:", decodedText);
                    await html5QrCode.stop(); // 스캐너 중지
                    qrCodeScannerRef.current = null; // 인스턴스 초기화
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
        if (isQRModalVisible) {
            // 모달이 열렸을 때만 스캐너 시작
            setTimeout(startScanner, 300); // DOM이 완전히 렌더링될 시간을 줌
        }

        // cleanup function
        return () => {
            if (qrCodeScannerRef.current) {
                qrCodeScannerRef.current.stop().catch(console.error); // 인스턴스 중지
                qrCodeScannerRef.current = null;
            }
        };
    }, [isQRModalVisible]);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <Button 
                type="primary" 
                icon={<ScanOutlined />} 
                onClick={() => setIsQRModalVisible(true)}
                size="large"
                style={{
                    height: '50px',
                    width: '200px',
                    fontSize: '16px',
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