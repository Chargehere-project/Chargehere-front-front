import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Sidebar,
    MapContainer,
    Heading,
    ChargerList,
    ChargerItem,
    ChargerInfo,
    ChargerName,
    ChargerAddress,
    LocationButton,
    SearchContainer,
    SearchInput,
    MyLocationButton,
    SearchWrapper,
    SearchResultsContainer,
    SearchResultItem
} from './MapComponentStyles';

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
        closeInfoWindow: () => void;
    }
}

interface SearchResult {
    place_name: string;
    address_name: string;
    x: string;  // 경도
    y: string;  // 위도
}

const MapComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [map, setMap] = useState<any>(null);
    const mapInstance = useRef<any>(null);
    const [chargerList, setChargerList] = useState<Charger[]>([]);
    const [favorites, setFavorites] = useState<Charger[]>([]);
    const [activeTab, setActiveTab] = useState<'chargers' | 'favorites'>('chargers');
    const [places, setPlaces] = useState<any>(null); // 장소 검색 서비스
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

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

                setPlaces(new window.kakao.maps.services.Places());
                
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
      // 검색 핸들러 추가
      const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!places || !searchQuery) return;

        // 검색 옵션 추가
        const searchOption = {
            location: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 중심점
            size: 1,  // 검색 결과 개수
            radius: 20000  // 검색 반경 (미터 단위)
        };

        places.keywordSearch(searchQuery, (results: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                console.log('검색 결과:', results); // 검색 결과 확인용

                // 첫 번째 결과의 좌표로 이동
                const firstResult = results[0];
                const moveLatLng = new window.kakao.maps.LatLng(firstResult.y, firstResult.x);
                
                // 지도 이동 및 줌 레벨 조정
                mapInstance.current.setCenter(moveLatLng);
                mapInstance.current.setLevel(3); // 줌 레벨 설정 (낮을수록 더 가깝게)

                // 검색된 위치에 마커 표시 (선택사항)
                new window.kakao.maps.Marker({
                    map: mapInstance.current,
                    position: moveLatLng,
                    title: firstResult.place_name
                });

                // 위치 이동 후 해당 지역의 충전소 데이터 새로 불러오기
                fetchChargerData(mapInstance.current);

            } else {
                alert('검색 결과를 찾을 수 없습니다.');
            }
        }, searchOption);
    };

    // 주소로 검색하는 함수 추가
    const searchAddressToCoordinate = (address: string) => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                
                // 지도 이동
                mapInstance.current.setCenter(coords);
                mapInstance.current.setLevel(3);

                // 마커 표시
                new window.kakao.maps.Marker({
                    map: mapInstance.current,
                    position: coords
                });

                // 충전소 데이터 새로 불러오기
                fetchChargerData(mapInstance.current);
            }
        });
    };

    // 통합 검색 핸들러
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!searchQuery) return;

        // 주소 검색 먼저 시도
        searchAddressToCoordinate(searchQuery);
    };
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
    
        // 검색어가 2글자 이상일 때만 자동완성 검색 실행
        if (value.length >= 2 && places) {
            const searchOption = {
                size: 5,  // 검색 결과를 5개로 제한
                location: new window.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 중심점
                radius: 20000 // 검색 반경 (미터 단위)
            };
    
            places.keywordSearch(value, (results: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    // 검색 결과 중 장소명과 주소만 추출하여 저장 (최대 5개)
                    const filteredResults = results.slice(0, 5).map((result: any) => ({
                        place_name: result.place_name,
                        address_name: result.address_name,
                        x: result.x,
                        y: result.y
                    }));
                    setSearchResults(filteredResults);
                    setIsSearching(true);
                }
            }, searchOption);
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    };
    // 검색 결과 항목 클릭 핸들러
    const handleSearchItemClick = (result: SearchResult) => {
        const moveLatLng = new window.kakao.maps.LatLng(result.y, result.x);
        mapInstance.current.setCenter(moveLatLng);
        mapInstance.current.setLevel(3);
        
        // 검색 결과 초기화
        setSearchResults([]);
        setIsSearching(false);
        setSearchQuery(result.place_name);

        // 새 마커 생성
        new window.kakao.maps.Marker({
            map: mapInstance.current,
            position: moveLatLng
        });

        // 해당 지역의 충전소 데이터 새로 불러오기
        fetchChargerData(mapInstance.current);
    };


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

        const infowindowContent = document.createElement('div');
        infowindowContent.style.cssText = `
        position: relative; 
        width: 250px; 
        padding: 15px; 
        border-radius: 8px; 
        background-color: white; 
        box-shadow: 0px 4px 10px rgba(0,0,0,0.2); 
        font-size: 14px; 
        line-height: 1.6; 
        color: #333;
    `;

        infowindowContent.innerHTML = `
        <h3 style="margin: 0; font-size: 16px; font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #ddd;">
            ${charger.statNm}
        </h3>
        <p style="margin: 8px 0 5px; color: #555;">주소: ${charger.addr}</p>
        <p style="margin: 5px 0; color: #555;">상태: ${getStatText(charger.stat)}</p>
        <p style="margin: 5px 0; color: #555;">연락처: ${charger.busiCall || '정보없음'}</p>
        <p style="margin: 5px 0; color: #555;">이용시간: ${charger.useTime || '정보없음'}</p>
        ${charger.lastTsdt ? `<p style="margin: 5px 0; color: #555;">마지막 충전: ${charger.lastTsdt}</p>` : ''}
    `;

        // 검정색 X 닫기 버튼 추가
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
        position: absolute; 
        top: 5px; 
        right: 5px; 
        background: none; 
        border: none; 
        font-size: 16px; 
        font-weight: bold;
        cursor: pointer; 
        color: black;
    `;

        closeButton.addEventListener('click', () => {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentInfoWindow = null;
            }
        });

        infowindowContent.appendChild(closeButton);

        const infowindow = new window.kakao.maps.InfoWindow({
            content: infowindowContent,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infowindow.open(map, marker);
            currentInfoWindow = infowindow;
        });

        charger.marker = marker;
    };

    // const moveToMarker = (charger: Charger) => {
    //     if (!mapInstance.current || !charger.marker) return;

    //     mapInstance.current.setCenter(charger.marker.getPosition());
    //     charger.marker.setZIndex(1);

    //     if (currentInfoWindow) {
    //         currentInfoWindow.close();
    //     }

    //     const infowindow = new window.kakao.maps.InfoWindow({
    //         content: `
    //         <div style="position: relative; width: 250px; padding: 15px; border-radius: 8px; background-color: white; box-shadow: 0px 4px 10px rgba(0,0,0,0.2); font-size: 14px; line-height: 1.6; color: #333;">
    //             <button onclick="closeInfoWindow()" style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 16px; cursor: pointer; color: #999;">✖️</button>
    //             <h3 style="margin: 0; font-size: 16px; font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #ddd;">${
    //                 charger.statNm
    //             }</h3>
    //             <p style="margin: 8px 0 5px; color: #555;">주소: ${charger.addr}</p>
    //             <p style="margin: 5px 0; color: #555;">상태: ${getStatText(charger.stat)}</p>
    //             <p style="margin: 5px 0; color: #555;">연락처: ${charger.busiCall || '정보없음'}</p>
    //             <p style="margin: 5px 0; color: #555;">이용시간: ${charger.useTime || '정보없음'}</p>
    //             ${charger.lastTsdt ? `<p style="margin: 5px 0; color: #555;">마지막 충전: ${charger.lastTsdt}</p>` : ''}
    //         </div>
    //     `,
    //     });

    //     infowindow.open(mapInstance.current, charger.marker);
    //     currentInfoWindow = infowindow;
    // };

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

        // 지도 중심을 해당 마커로 이동
        mapInstance.current.setCenter(charger.marker.getPosition());
        charger.marker.setZIndex(1);

        // 기존 인포윈도우 닫기
        if (currentInfoWindow) {
            currentInfoWindow.close();
        }

        // 새로운 인포윈도우 생성
        const infowindowContent = document.createElement('div');
        infowindowContent.style.cssText = `
        position: relative; 
        width: 250px; 
        padding: 15px; 
        border-radius: 8px; 
        background-color: white; 
        box-shadow: 0px 4px 10px rgba(0,0,0,0.2); 
        font-size: 14px; 
        line-height: 1.6; 
        color: #333;
    `;
        infowindowContent.innerHTML = `
        <h3 style="margin: 0; font-size: 16px; font-weight: bold; padding-bottom: 5px; border-bottom: 1px solid #ddd;">
            ${charger.statNm}
        </h3>
        <p style="margin: 8px 0 5px; color: #555;">주소: ${charger.addr}</p>
        <p style="margin: 5px 0; color: #555;">상태: ${getStatText(charger.stat)}</p>
        <p style="margin: 5px 0; color: #555;">연락처: ${charger.busiCall || '정보없음'}</p>
        <p style="margin: 5px 0; color: #555;">이용시간: ${charger.useTime || '정보없음'}</p>
        ${charger.lastTsdt ? `<p style="margin: 5px 0; color: #555;">마지막 충전: ${charger.lastTsdt}</p>` : ''}
    `;

        // 닫기 버튼 추가
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
        position: absolute; 
        top: 5px; 
        right: 5px; 
        background: none; 
        border: none; 
        font-size: 16px; 
        font-weight: bold;
        cursor: pointer; 
        color: black;
    `;
        closeButton.addEventListener('click', () => {
            if (currentInfoWindow) {
                currentInfoWindow.close();
                currentInfoWindow = null;
            }
        });

        infowindowContent.appendChild(closeButton);

        const infowindow = new window.kakao.maps.InfoWindow({
            content: infowindowContent,
        });

        // 인포윈도우 열기
        infowindow.open(mapInstance.current, charger.marker);
        currentInfoWindow = infowindow;
    };

    return (
        <Container>
        <Sidebar>
            <Heading>충전소 목록</Heading>
            <SearchContainer>
                <SearchWrapper>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <SearchInput
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            placeholder="지역, 동, 주소를 입력하세요"
                        />
                        {isSearching && searchResults.length > 0 && (
                            <SearchResultsContainer>
                                {searchResults.map((result, index) => (
                                    <SearchResultItem 
                                        key={index} 
                                        onClick={() => handleSearchItemClick(result)}
                                    >
                                        <div className="place-name">{result.place_name}</div>
                                        <div className="address">{result.address_name}</div>
                                    </SearchResultItem>
                                ))}
                            </SearchResultsContainer>
                        )}
                        <button type="submit" onClick={() => handleSearchItemClick(searchResults[0])}>
                            검색
                        </button>
                    </form>
                </SearchWrapper>
                <MyLocationButton onClick={getUserLocation}>
                    현재 위치
                </MyLocationButton>
            </SearchContainer>

            <ChargerList>
                {chargerList.map((charger) => (
                    <ChargerItem key={charger.statId}>
                        <ChargerInfo>
                            <ChargerName>{charger.statNm}</ChargerName>
                            <ChargerAddress>{charger.addr}</ChargerAddress>
                        </ChargerInfo>
                        <LocationButton onClick={() => moveToMarker(charger)}>
                            위치 보기
                        </LocationButton>
                    </ChargerItem>
                ))}
            </ChargerList>
        </Sidebar>
        <MapContainer ref={mapContainer} />
    </Container>
    );
};

    
export default MapComponent;