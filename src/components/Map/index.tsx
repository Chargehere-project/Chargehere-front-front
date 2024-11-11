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
   const mapInstance = useRef<any>(null);  // 지도 인스턴스를 저장할 ref 추가
   let currentInfoWindow: any = null; // 현재 열려 있는 인포윈도우를 저장

   // 최초 1회만 지도 생성
   useEffect(() => {
       const script = document.createElement('script');
       script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&libraries=services&autoload=false`;
       script.async = true;

       script.onload = () => {
           if (window.kakao && window.kakao.maps) {
               window.kakao.maps.load(() => {
                   if (!mapContainer.current || mapInstance.current) return;
                   
                   // 지도 생성은 한 번만
                   mapInstance.current = new window.kakao.maps.Map(mapContainer.current, {
                       center: new window.kakao.maps.LatLng(37.54357038203505, 126.9513771249514),
                       level: 5,
                   });
                   setMap(mapInstance.current);
                   fetchChargerData(mapInstance.current);
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

   const fetchChargerData = async (map: any) => {
       try {
           const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chargers`, {
               params: {
                   pageNo: 1,
                   numOfRows: 10,
                   period: 5,
                   zcode: 11
               }
           });
           console.log('API 응답:', response);
           if (response.data.success) {
               const chargers = response.data.data;
               console.log('가져온 충전소 데이터:', chargers);
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

       window.kakao.maps.event.addListener(marker, 'click', () => {
           if (currentInfoWindow) {
               currentInfoWindow.close();
           }
           infowindow.open(map, marker);
           currentInfoWindow = infowindow;
       });

       window.kakao.maps.event.addListener(map, 'click', () => {
           if (currentInfoWindow) {
               currentInfoWindow.close();
               currentInfoWindow = null;
           }
       });
   };

   const handleSearch = () => {
       if (!searchQuery || !mapInstance.current) return;

       const geocoder = new window.kakao.maps.services.Geocoder();
       const ps = new window.kakao.maps.services.Places();

       geocoder.addressSearch(searchQuery, (result: any[], status: string) => {
           if (status === window.kakao.maps.services.Status.OK) {
               const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
               mapInstance.current.setCenter(coords);
           } else {
               ps.keywordSearch(searchQuery, (result: any[], status: string) => {
                   if (status === window.kakao.maps.services.Status.OK) {
                       const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                       mapInstance.current.setCenter(coords);
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
       <div style={{ 
           position: 'relative',
           width: '100%',
           height: '100%',
           backgroundColor: 'white'
       }}>
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
                   borderRadius: '8px',
                   position: 'relative',
                   overflow: 'hidden',
                   background: 'white'
               }}
           />
       </div>
   );
};

export default MapComponent;