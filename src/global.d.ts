declare module "html5-qrcode" {
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
      isScanning?: boolean;  // 추가적으로 필요한 속성 정의
    }
  }