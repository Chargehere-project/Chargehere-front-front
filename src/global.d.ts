// global.d.ts (이미 존재하는 파일)
declare global {
    interface Window {
        daum: any; // daum 객체를 window 객체에 추가
    }
}

// 이 아래는 이미 있는 코드 그대로 유지
declare module 'html5-qrcode' {
    export class Html5Qrcode {
        static stop() {
            throw new Error('Method not implemented.');
        }
        constructor(elementId: string);
        start(
            cameraConfig: { facingMode: string },
            config?: { fps?: number; qrbox?: { width: number; height: number } },
            onSuccess?: (decodedText: string) => void,
            onFailure?: (error: any) => void
        ): Promise<void>;
        stop(): Promise<void>; // stop 메서드 타입 명시
        isScanning?: boolean; // 추가적으로 필요한 속성 정의
    }
}

declare global {
  interface Window {
    daum: any;  // daum 객체를 window 객체에 추가
  }
}

export {};  // 이 줄을 추가하여 TypeScript가 전역 모듈로 인식하도록 합니다.
