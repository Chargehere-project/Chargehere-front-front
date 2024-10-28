import { useEffect, useRef } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
const Roulette = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const product = [
       "꽝", '500P', "300P", "꽝", "700P", "최고급 세단",
   ];
   const colors = [
       "#DC0936", "#531DE6", "#F7A416", "#EFE61F ", "#60B236",
       "#209B6C","#209B6C"]
   useEffect(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const ctx = canvas.getContext('2d');
       if (!ctx) return;
       // newMake 함수 내용
       const [cw, ch] = [canvas.width / 2, canvas.height / 2];
       const arc = Math.PI / (product.length / 2);
       // 룰렛 섹션 그리기
       for (let i = 0; i < product.length; i++) {
           ctx.beginPath();
           ctx.fillStyle = colors[i % (colors.length - 1)];
           ctx.moveTo(cw, ch);
           ctx.arc(cw, ch, cw, arc * (i - 1), arc * i);
           ctx.fill();
           ctx.closePath();
       }
       // 텍스트 스타일 설정
       ctx.fillStyle = "#fff";
       ctx.font = "18px Pretendard";
       ctx.textAlign = "center";
       // 텍스트 그리기
       for (let i = 0; i < product.length; i++) {
           const angle = (arc * i) + (arc / 2);
           ctx.save();
           ctx.translate(
               cw + Math.cos(angle) * (cw - 50),
               ch + Math.sin(angle) * (ch - 50),
           );
           ctx.rotate(angle + Math.PI / 2);
           product[i].split(" ").forEach((text, j) => {
               ctx.fillText(text, 0, 30 * j);
           });
           ctx.restore();
       }
   }, []); // 빈 배열은 컴포넌트가 마운트될 때 한 번만 실행됨을 의미
   const token = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded: any = jwtDecode(token);
        return decoded.UserID;  // 토큰에서 UserID를 추출
    } catch (error) {
        console.error('토큰 디코드 에러:', error);
        return null;
    }
};
const awardPoints = async (reward: string) => {
  try {
      const userId = token();  // 토큰에서 userId 가져오기
      if (!userId) {
          alert('로그인이 필요합니다.');
          return;
      }
      let points = 0;
      if (reward === '500P') {
          points = 500;
      } else if (reward === '300P') {
          points = 300;
      } else if (reward === '700P') {
          points = 700;
      }
      if (points > 0) {
          const response = await axios.post('http://localhost:8000/everydayevent', {
              userId: userId,  // 실제 사용자 ID 사용
              points: points,
              reward: reward
          }, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
              }
          });
          if (response.data.success) {
              alert(`축하합니다! ${reward} 가 지급되었습니다!`);
          }
      }
  } catch (error) {
      console.error('포인트 지급 중 오류:', error);
      alert('포인트 지급 중 오류가 발생했습니다.');
  }
};
// 오전 6시 체크 함수
const checkResetTime = () => {
  const now = new Date();
  const resetTime = new Date(now);
  resetTime.setHours(6, 0, 0, 0);  // 오전 6시로 설정
   // 현재 시간이 오전 6시 이후라면 다음 날 오전 6시로 설정
  if (now >= resetTime) {
    resetTime.setDate(resetTime.getDate() + 1);
}
  return resetTime;
};
// localStorage 저장 함수
const setLastPlayTime = () => {
  const obj = {
      lastPlayed: new Date().getTime(),  // 현재 시간 저장
      nextReset: checkResetTime().getTime()  // 다음 초기화 시간 저장
  };
  localStorage.setItem('roulettePlay', JSON.stringify(obj));
};
// 플레이 가능 여부 체크 함수
const canPlay = () => {
  const playData = localStorage.getItem('roulettePlay');
  if (!playData) return true;  // 데이터가 없으면 플레이 가능
  const { lastPlayed, nextReset } = JSON.parse(playData);
  const now = new Date().getTime();
  // 현재 시간이 마지막 초기화 시간을 지났는지 확인
  return now >= nextReset;
};
   // 회전 함수
   const handleRotate = () => {
    if (!canPlay()) {
      alert('오늘은 이미 룰렛을 돌리셨습니다. 내일 오전 6시 이후에 다시 시도해주세요.');
      return;
  }
       const canvas = canvasRef.current;
       if (!canvas) return;
       canvas.style.transform = `initial`;
       canvas.style.transition = `initial`;
       setTimeout(() => {
        // 여기서 당첨 위치가 결정됨
        const ran = Math.floor(Math.random() * product.length); // 랜덤으로 섹션 선택
        const arc = 360 / product.length;  // 각 섹션의 각도
        const rotate = (ran * arc) + 3600 + 120;// 회전할 총 각도 계산
        canvas.style.transform = `rotate(-${rotate}deg)`;  // 실제 회전
           canvas.style.transition = `2s`;
           setTimeout(() => {
            const reward = product[ran];
            alert(`${reward} 에 당첨되셨습니다.`);
            setLastPlayTime();
            awardPoints(reward);  // 당첨된 상품에 따라 포인트 지급
        }, 2000);
    }, 1);
   };
   // 스타일 정의
   const containerStyle = {
       display: 'flex',
       flexDirection: 'column' as 'column',
       alignItems: 'center',
       gap: '20px',
       padding: '20px'
   };
   const buttonStyle = {
       padding: '10px 20px',
       fontSize: '16px',
       backgroundColor: '#007BFF',
       color: 'white',
       border: 'none',
       borderRadius: '5px',
       cursor: 'pointer'
   };
   return (
       <div style={containerStyle}>
           <canvas
               ref={canvasRef}
               width="500"
               height="500"
           />
           <button
               onClick={handleRotate}
               style={buttonStyle}
           >
               룰렛 돌리기
           </button>
       </div>
   );
};
export default Roulette;