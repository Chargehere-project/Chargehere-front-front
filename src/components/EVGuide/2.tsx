import Image from 'next/image';
import Link from 'next/link';

const EVGuide2 = () => {
    return (
        <>
            <h2>전기차 기초 정보</h2>
            <p style={{ fontSize: '20px' }}>
                전기차는 어떤 모터를 사용할까? 모터의 종류와 원리에 대해 알아보자
            </p>
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
            {/* 다음 글로 이동 버튼 */}
            <div style={{ marginTop: '20px' }}>
                <Link href="/evguide2" legacyBehavior>
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
        </>
    );
};

export default EVGuide2;
