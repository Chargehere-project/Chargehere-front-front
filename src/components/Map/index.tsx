import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface Charger {
    statId: string;
    statNm: string;
    addr: string;
    lat: string;
    lng: string;
    useTime: string;
    busiCall: string;
    stat: string;
    statUpdDt?: string;
    chgerId?: string;
    lastTsdt?: string;
    lastTedt?: string;
    nowTsdt?: string;
    marker?: any; // 마커 속성 추가
}

declare global {
    interface Window {
        kakao: any;
    }
}

const MapComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [map, setMap] = useState<any>(null);
    const mapInstance = useRef<any>(null);
    const [chargerList, setChargerList] = useState<Charger[]>([]);
    const [favorites, setFavorites] = useState<Charger[]>([]);
    const [activeTab, setActiveTab] = useState<'chargers' | 'favorites'>('chargers');
    let currentInfoWindow: any = null;

    // 로컬 스토리지에서 즐겨찾기 불러오기
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // 카카오맵 스크립트 로드 및 초기화
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`;
        script.async = true;

        script.onload = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    if (!mapContainer.current || mapInstance.current) return;
                    mapInstance.current = new window.kakao.maps.Map(mapContainer.current, {
                        center: new window.kakao.maps.LatLng(37.54357038203505, 126.9513771249514),
                        level: 5,
                    });
                    setMap(mapInstance.current);
                    fetchChargerData(mapInstance.current);

                    // 지도 클릭 시 인포윈도우 닫기
                    window.kakao.maps.event.addListener(mapInstance.current, 'click', () => {
                        if (currentInfoWindow) {
                            currentInfoWindow.close();
                            currentInfoWindow = null;
                        }
                    });
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // 충전소 데이터 가져오기
    const fetchChargerData = async (map: any) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chargers`, {
                params: {
                    pageNo: 1,
                    numOfRows: 10,
                    period: 5,
                    zcode: 11,
                },
            });
            if (response.data.success) {
                const chargers = response.data.data;
                setChargerList(chargers);
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

    const createMarkerAndInfoWindow = (map: any, charger: Charger) => {
        const position = new window.kakao.maps.LatLng(parseFloat(charger.lat), parseFloat(charger.lng));
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

        window.kakao.maps.event.addListener(marker, 'click', () => {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;
        });

        charger.marker = marker; // 마커를 충전소 데이터에 추가
    };

    const getStatText = (stat: string) => {
        switch (stat) {
            case '1':
                return '통신이상';
            case '2':
                return '충전대기';
            case '3':
                return '충전중';
            case '4':
                return '운영중지';
            case '5':
                return '점검중';
            case '9':
                return '상태미확인';
            default:
                return '알 수 없음';
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation = new window.kakao.maps.LatLng(latitude, longitude);
                    mapInstance.current.setCenter(userLocation);

                    new window.kakao.maps.Marker({
                        position: userLocation,
                        map: mapInstance.current,
                        title: '현재 위치',
                    });
                },
                (error) => {
                    alert('현재 위치를 가져올 수 없습니다.');
                    console.error(error);
                }
            );
        } else {
            alert('브라우저에서 현재 위치를 지원하지 않습니다.');
        }
    };

    const toggleFavorite = (charger: Charger) => {
        setFavorites((prev) => {
            const isFavorite = prev.find((fav) => fav.statId === charger.statId);
            const updatedFavorites = isFavorite
                ? prev.filter((fav) => fav.statId !== charger.statId)
                : [
                    ...prev,
                    // marker 속성을 제외한 데이터를 저장
                    {
                        ...charger,
                        marker: undefined, // marker 속성을 제외
                    },
                ];
    
            // 로컬 스토리지에 저장
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
            return updatedFavorites;
        });
    };
    const moveToMarker = (charger: Charger) => {
        if (!mapInstance.current || !charger.marker) return;

        mapInstance.current.setCenter(charger.marker.getPosition());
        charger.marker.setZIndex(1);

        if (currentInfoWindow) {
            currentInfoWindow.close();
        }

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

        infowindow.open(mapInstance.current, charger.marker);
        currentInfoWindow = infowindow;
                            // 지도 클릭 시 인포윈도우 닫기
                            window.kakao.maps.event.addListener(mapInstance.current, 'click', () => {
                                if (currentInfoWindow) {
                                    currentInfoWindow.close();
                                    currentInfoWindow = null;
                                }
                            })
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: 'white', padding: '20px' }}>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="지역 또는 주소를 입력하세요"
                    style={{ flex: 1, padding: '8px' }}
                />
                <button onClick={getUserLocation} style={{ padding: '8px', marginLeft: '10px' }}>
                    현재 위치
                </button>
            </div>

            <div
                ref={mapContainer}
                style={{
                    width: '100%',
                    height: '600px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginBottom: '10px',
                }}
            />

            <div>
                <button onClick={() => setActiveTab('chargers')}>충전소 목록</button>
                <button onClick={() => setActiveTab('favorites')}>즐겨찾기</button>
            </div>

            <div style={{ overflowY: 'scroll', height: '200px', border: '1px solid #ccc', padding: '10px' }}>
                {activeTab === 'chargers' ? (
                    <>
                        <h3>충전소 목록</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {chargerList.map((charger) => (
                                <li key={charger.statId} style={{ marginBottom: '10px' }}>
                                    <strong>{charger.statNm}</strong>
                                    <p>{charger.addr}</p>
                                    <button onClick={() => toggleFavorite(charger)}>
                                        {favorites.some((fav) => fav.statId === charger.statId)
                                            ? '즐겨찾기 해제'
                                            : '즐겨찾기 추가'}
                                    </button>
                                    <button onClick={() => moveToMarker(charger)}>위치 보기</button>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <>
                        <h3>즐겨찾기 목록</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {favorites.map((charger) => (
                                <li key={charger.statId} style={{ marginBottom: '10px' }}>
                                    <strong>{charger.statNm}</strong>
                                    <p>{charger.addr}</p>
                                    <button onClick={() => toggleFavorite(charger)}>
                                        즐겨찾기 해제
                                    </button>
                                    <button onClick={() => moveToMarker(charger)}>위치 보기</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default MapComponent;