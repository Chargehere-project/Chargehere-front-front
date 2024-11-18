import React, { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const RetroContainer = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  font-family: "돋움", Dotum, Arial, sans-serif;

  h2 {
    font-size: 20px;
    color: #004080;
    border-bottom: 2px solid #004080;
    padding-bottom: 10px;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .post-meta {
    font-size: 12px;
    color: #666666;
    background-color: #f5f5f5;
    padding: 5px 10px;
    border: 1px solid #dddddd;
    margin: 10px 0;
  }

  .post-content {
    font-size: 12px;
    line-height: 1.6;
    color: #333333;
    margin: 20px 0;

    p {
      margin: 15px 0;
      text-align: justify;
      font-size: 15px;
    }
  }

  .image-container {
    text-align: center;
    background-color: #f9f9f9;
    padding: 10px;
    border: 1px solid #dddddd;
    margin: 15px 0;
  }

  .navigation-button {
    text-align: right;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #dddddd;

    a {
      display: inline-block;
      padding: 5px 15px;
      background-color: #6699cc;
      color: #ffffff;
      text-decoration: none;
      font-size: 12px;
      border: 1px solid #336699;

      &:hover {
        background-color: #336699;
      }
    }
  }

  .title-text {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    background-color: #f0f0f0;
    padding: 8px;
    border-left: 5px solid #004080;
    margin: 15px 0;
  }
`;

const EVGuide = () => {
  const [visibleContent, setVisibleContent] = useState<number | null>(null);

  const toggleContentVisibility = (index: number) => {
    setVisibleContent((prev) => (prev === index ? null : index));
  };

    return (
        <RetroContainer>
        <h2 onClick={() => toggleContentVisibility(1)}>전기차 기초 정보</h2>
      {visibleContent === 1 && (
        <div className="post-content">

                    <p style={{ fontSize: '20px' }}>아파트 주차장에 설치된 전기차 급속충전기 얼마나 사용할까요</p>
                    <p>2022.05.14</p>
                    <Image src="/guide1.jpg" alt="Example Image" width={500} height={300} />
                    <p>
                        요즘 아파트의 주차장은 지상보다는 지하 많이 있습니다. 또한 아파트 주차장은 입주민을 위한 공간이기도
                        합니다. 제가 아르바이트로 배달 일을 하고 있어 다양한 아파트 지하주차장을 가보곤 하는데요. 최근 전기차
                        충전소가 설치된 아파트 주차장을 보면 전기차 보급이 그만큼 늘었고 그에 따른 충전 환경도 점점 늘어간다는
                        생각이 들었습니다. 불과 3~4년 전만 해도 아파트 주차장에서 전기차 충전소를 마련하지 않은 곳도 많았지만
                        요즘은 많이 달려졌습니다.
                    </p>
                    <Image src="/guide2.jpg" alt="Example Image" width={200} height={250} />
                    <p>
                        전기차 완속 충전기는 충전양에 따라 보통 5~10시간 이상의 충전시간이 필요하기 때문에 주차와 충전을
                        병행하는데 급속충전은 1시간 정도로 끝내야 하는 상황이라 이렇게 주거공간인 아파트 주차장에 잠시 충전을 할
                        빈도는 그리 높지 않다고 봅니다. 그리고 충전 단가도 급속충전이 상대적으로 비싸니 주거공간인 아파트에서
                        급속충전을 할 상황은 별로 발생하지 않을 겁니다.
                    </p>
                    <Image src="/guide3.jpg" alt="Example Image" width={250} height={250} />
                    <p>
                        차라리 급속 충전기 설치 가격으로 완속 충전시설을 더 많이 늘리는 것이 효율적이지 않을까요? 이런 제안을
                        듣는다면 일반 내연기관 차량을 소유한 차주분들은 반발을 할 겁니다. “전기차 완속 충전이 가능한 주차 자리에
                        전기차만 이용하게 되면 한정된 주차공간을 같이 사용하는 일반 차량의 주차공간이 줄어들어 불편하다!”
                    </p>
                    <p>
                        ” 난 반댈세!” 네 맞습니다. 그런데 그분들도 전기차로 바꾼다면 입장이 바뀌겠죠. 아파트 같은 공간은
                        주민들이 주차장을 공유하는 곳이니 다른 주차 자리가 있는데 전기차 충전하는 곳을 점거하면 안 됩니다.
                        상황에 따라 달라지겠지만 입주민들의 이해가 필요한 부분이기도 합니다. 만약 입주 세대에 전기차가
                        1~2대뿐인데 전기차 충전하는 구역이 5기가 설치되어 있다면 관리사무소에서 탄력적으로 운영해도 될 거라
                        봅니다. 원칙적으로는 주차하면 안 되겠지만 부득이한 경우에는 일부 공유할 수 있다고 봅니다.
                    </p>

                    </div>
            )}

            
      {/* 두 번째 글 */}
              <h2 onClick={() => toggleContentVisibility(2)}>전기차의 원리</h2>
              {visibleContent === 2 && (
                <div className="post-content">
                  <p style={{ fontSize: '20px' }}>전기차는 어떤 모터를 사용할까? 모터의 종류와 원리에 대해 알아보자</p>
                  <p>2023.04.18</p>
                  <Image src="/guide4.jpg" alt="Example Image" width={500} height={300} />
                  <p>
                      1. DC 모터: DC 모터는 고정자로 자석을 사용하고, 회전자로 코일을 사용하여 브러쉬를 이용하여 전류의 방향을
                      전환합니다. 플레밍의 왼손 법칙으로 중학교/고등학교 때 나오는 내용입니다. DC 모터는 회로가 단순하고
                      가격도 저렴합니다. 다만 브러쉬라는 부품을 이용하기 때문에 마찰 때문에 내구성이 떨어지고 소음이
                      발생한다는 단점이 있습니다. 미니카 모터, 휴대용 선풍기 등이 대표적으로 DC 모터입니다.
                  </p>
                  <Image src="/guide2.jpg" alt="Example Image" width={200} height={250} />
                  <p>
                      2. BLDC 모터: 브러쉬리스 모터 BLDC 모터입니다. 앞서 언급한 브러쉬를 없앴다고 해서 BLDC 모터입니다.
                      최근에 다이슨 헤어드라이어, 선풍기 등에 적용되면서 고급 전자제품에 많이 적용되어서 일반인들에게도 널리
                      알려진 모터입니다. 고정자가 코일을 감은 전자석이고, 회전자가 영구자석입니다. 전자석이 N극 S극을
                      만들어주면서 영구자석을 회전시키는 것입니다. 그리고 영구자석의 N극/S극 위치를 알아야 정확한 시점에
                      전자석을 N극 S극을 만들기 때문에 영구자석 위치를 알 수 있는 홀센서가 부착되어 있습니다. 브러쉬가 없기
                      때문에 내구성이 좋고 소음이 적습니다. 다만 회로 및 제어가 살짝 복잡해집니다.
                  </p>
                  <Image src="/guide6.png" alt="Example Image" width={250} height={250} />
                  <p>
                      3. PMSM 모터: 다음은 PMSM이라고 불리는 모터입니다. PMSM은 역기전력이 사인파 형태로 발생합니다.그래서
                      BLDC 처럼 on/off 제어를 하면 안되고 전기 역시 사인파를 발생시켜줘야합니다. BLDC는 쉽게 말해서 on/off
                      밖에 안되기 때문에 1step 씩 끊어서 이동을 하는거고요, PMSM은 순시적으로 강약을 조절할 수가 있어서
                      부드럽게 이동합니다.
                  </p>
                  <Image src="/guide5.png" alt="Example Image" width={250} height={250} />
                  <p>
                      4.유도 전동기 : 마지막으로 테슬라 모델 S, X에 적용되었던 유도 전동기입니다. 유도전동기는 영구자석을 안
                      쓰고 빈 깡통 주위에 자석을 회전시키게 되면 깡통에 와전류가 발생하고 그로 인해 깡통도 자석을 따라 같이
                      회전하는 원리입니다. 영구자석을 사용하지 않기 때문에 구조도 단순하고 가격이 저렴합니다. 하지만
                      에너지밀도가 낮고 효율이 낮고 제어도 어려워서 전기차에서 많은 선택을 받고 있지는 못합니다.
                  </p>
                  <Image src="/guide3.jpg" alt="Example Image" width={250} height={250} />
                  <p>
                      최근에 전기차 연구는 대부분 PMSM을 기반으로 해서 연구가 진행되고 있고요, 자석의 배치, 물성 조합, 제어
                      방식, 권선 감는 방식, 냉각, 고정자 치 설계 등 세부적으로 다양한 연구가 진행되고 있습니다.
                  </p>
                </div>
      )}
            </RetroContainer>
    );
};

export default EVGuide;