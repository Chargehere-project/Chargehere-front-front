import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
interface Charger {
    statId: string;       // 충전소 ID
    statNm: string;       // 충전소 명칭
    addr: string;         // 주소
    lat: string;          // 위도
    lng: string;          // 경도
    useTime: string;      // 이용시간
    busiCall: string;     // 연락처
    stat: string;         // 충전기 상태
    statUpdDt?: string;   // 상태 업데이트 시간
    chgerId?: string;     // 충전기 ID
    lastTsdt?: string;    // 마지막 충전 시작 시간
    lastTedt?: string;    // 마지막 충전 종료 시간
    nowTsdt?: string;     // 현재 충전 시작 시간
}
declare global {
    interface Window {
        kakao: any;
    }
}
const MapComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [map, setMap] = useState<any>(null); // 지도 객체 상태
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    if (!mapContainer.current) return;
                    const map = new window.kakao.maps.Map(mapContainer.current, {
                        center: new window.kakao.maps.LatLng(37.54357038203505, 126.9513771249514),
                        level: 5,
                    });
                    setMap(map)
                    // 충전소 데이터 가져오기
                    fetchChargerData(map);
                });
            }
        };
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);
    const fetchChargerData = async (map: any) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chargers`, {
                params: {
                    pageNo: 1,
                    numOfRows: 10,
                    period: 5,
                    zcode: 11
                }
            });
            console.log('API 응답:', response); // 응답 데이터 확인
            if (response.data.success) {
                const chargers = response.data.data;
                console.log('가져온 충전소 데이터:', chargers); // 데이터가 정상적으로 들어오는지 확인
                chargers.forEach((charger: Charger) => {
                    createMarkerAndInfoWindow(map, charger);
                });
            } else {
                console.error('API 실패:', response.data.message);
            }
        } catch (error) {
            console.error('API 호출 중 오류:', error);
        }
    };
    const getStatText = (stat: string) => {
        switch(stat) {
            case '1': return '통신이상';
            case '2': return '충전대기';
            case '3': return '충전중';
            case '4': return '운영중지';
            case '5': return '점검중';
            case '9': return '상태미확인';
            default: return '알 수 없음';
        }
    };
    // 마커 생성 시 상태에 따른 스타일 적용
    let currentInfoWindow: any = null; // 현재 열려 있는 인포윈도우를 저장
    const createMarkerAndInfoWindow = (map: any, charger: Charger) => {
        const position = new window.kakao.maps.LatLng(
            parseFloat(charger.lat),
            parseFloat(charger.lng)
        );
        const marker = new window.kakao.maps.Marker({
            position: position,
            map: map,
        });
        const infowindow = new window.kakao.maps.InfoWindow({
            content: `
                <div style="padding:10px;">
                    <h3>${charger.statNm}</h3>
                    <p>주소: ${charger.addr}</p>
                    <p>상태: ${getStatText(charger.stat)}</p>
                    <p>연락처: ${charger.busiCall || '정보없음'}</p>
                    <p>이용시간: ${charger.useTime || '정보없음'}</p>
                    ${charger.lastTsdt ? `<p>마지막 충전: ${charger.lastTsdt}</p>` : ''}
                </div>
            `,
        });
        // 마커 클릭 시 인포윈도우 열기
        window.kakao.maps.event.addListener(marker, 'click', () => {
            // 기존에 열려 있던 인포윈도우 닫기
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            // 새로 클릭한 인포윈도우 열기
            infowindow.open(map, marker);
            currentInfoWindow = infowindow; // 현재 인포윈도우 저장
        });
        window.kakao.maps.event.addListener(map, 'click', () => {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentInfoWindow = null; // 초기화
            }
        });
    };
    const handleSearch = () => {
        if (!searchQuery) return;
        if (!map) {
            console.error('지도 객체가 초기화되지 않았습니다.');
            return;
        }
        const geocoder = new window.kakao.maps.services.Geocoder();
        const ps = new window.kakao.maps.services.Places();
        // 먼저 주소로 검색합니다.
        geocoder.addressSearch(searchQuery, (result: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                map.setCenter(coords); // 지도의 중심을 검색된 주소로 이동
                console.log('주소로 검색된 좌표:', coords);
            } else {
                // 주소 검색 결과가 없으면 키워드로 검색합니다.
                ps.keywordSearch(searchQuery, (result: any[], status: string) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        map.setCenter(coords); // 지도의 중심을 검색된 장소로 이동
                        console.log('키워드로 검색된 장소:', coords);
                    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                        alert('검색 결과가 없습니다.');
                    } else {
                        alert('검색 중 오류가 발생했습니다.');
                    }
                });
            }
        });
    };
    return (
        <div>
            {/* 검색 창 */}
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="지역 또는 주소를 입력하세요"
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={handleSearch} style={{ padding: '8px' }}>
                    검색
                </button>
            </div>
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '800px',
                border: '1px solid #ccc',
                borderRadius: '8px'
            }}
        />
        </div>
    );
};
export default MapComponent;