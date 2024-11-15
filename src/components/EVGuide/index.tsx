import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

const EVGuide1 = () => {
    const [isContentVisible, setIsContentVisible] = useState(false);

    const toggleContentVisibility = () => {
        setIsContentVisible((prev) => !prev);
    };

    return (
        <>
        <RetroContainer>
            <h2 onClick={toggleContentVisibility}>전기차 기초 정보</h2>
            {isContentVisible && (
                <>
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
                </>
            )}
            {/* 다음 글로 이동 버튼 */}
            <div style={{ marginTop: '20px' }}>
                <Link href="/mall/evguide/2" legacyBehavior>
                    <a
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#0070f3',
                            color: '#fff',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '16px',
                        }}
                    >
                        다음 글 보기 &rarr;
                    </a>
                </Link>
            </div>
            </RetroContainer>
        </>
    );
};

export default EVGuide1;