import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import { useRouter } from 'next/router';

const ChargingComplete = () => {
    const router = useRouter();

    return (
        <div style={{ 
            padding: '50px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
        }}>
            <Result
                status="success"
                title="충전이 시작되었습니다!"
                subTitle={`충전 시작 시간: ${new Date().toLocaleString()}`}
                extra={[
                    <Button 
                        type="primary" 
                        key="console"
                        onClick={() => router.push('/charging/status')}
                    >
                        충전 상태 보기
                    </Button>,
                    <Button 
                        key="home"
                        onClick={() => router.push('/chargemain')}
                    >
                        메인으로
                    </Button>,
                ]}
            />
        </div>
    );
};

export default ChargingComplete;