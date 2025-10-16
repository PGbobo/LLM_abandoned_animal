document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('map');
    const missingPostsContainer = document.getElementById('missing-posts-container');
    const witnessPostsContainer = document.getElementById('witness-posts-container');
    
    // ----------------------------------------------------
    // 1. 카카오맵 초기화 및 마커 표시
    // ----------------------------------------------------

    if (mapContainer && typeof kakao !== 'undefined' && kakao.maps) {
        kakao.maps.load(function() {
            // 지도 초기 설정 (광주광역시 중심)
            const mapOption = { 
                center: new kakao.maps.LatLng(35.1601, 126.8517),
                level: 7 // 광주광역시 전체를 볼 수 있는 레벨
            };
            const map = new kakao.maps.Map(mapContainer, mapOption); 
            const markerList = []; // 마커 객체를 담을 배열

            // 커스텀 마커 이미지 경로 (404 오류를 피하려면 실제 이미지 파일이 필요)
            const RED_MARKER_SRC = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
            const BLUE_MARKER_SRC = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png';
            const imageSize = new kakao.maps.Size(32, 35);
            
            const redMarkerImage = new kakao.maps.MarkerImage(RED_MARKER_SRC, imageSize);
            const blueMarkerImage = new kakao.maps.MarkerImage(BLUE_MARKER_SRC, imageSize);

            function createMarker(lat, lng, type, title) {
                const position = new kakao.maps.LatLng(lat, lng);
                const markerImage = type === 'missing' ? redMarkerImage : blueMarkerImage;

                const marker = new kakao.maps.Marker({
                    map: map,
                    position: position,
                    title: title,
                    image: markerImage
                });

                // 인포윈도우 (클릭 시 상세 정보 표시)
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px; font-weight:600; font-size:12px;">${title} (${type === 'missing' ? '실종' : '목격'})</div>`
                });

                // 마커에 이벤트 리스너 추가
                kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });
                
                return marker;
            }

            function loadMarkers() {
                // 기존 마커 모두 제거
                markerList.forEach(m => m.setMap(null));
                markerList.length = 0; // 배열 초기화

                const containers = [
                    { element: missingPostsContainer, type: 'missing' },
                    { element: witnessPostsContainer, type: 'witness' }
                ];

                let missingCount = 0;
                let witnessCount = 0;

                containers.forEach(container => {
                    const cards = container.element.querySelectorAll('.map-item-card');
                    cards.forEach(card => {
                        const lat = parseFloat(card.dataset.lat);
                        const lng = parseFloat(card.dataset.lng);
                        const petName = card.querySelector('.text-base').textContent.trim();
                        
                        if (lat && lng) {
                            const marker = createMarker(lat, lng, container.type, petName);
                            markerList.push(marker);
                            
                            // 카드 클릭 시 해당 마커로 이동 및 인포윈도우 표시
                            card.addEventListener('click', () => {
                                map.setCenter(marker.getPosition());
                                // 마커를 클릭하여 인포윈도우를 다시 표시
                                kakao.maps.event.trigger(marker, 'click');
                            });
                            
                            // 카운트 업데이트
                            if (container.type === 'missing') {
                                missingCount++;
                            } else {
                                witnessCount++;
                            }
                        }
                    });
                });
                
                // 범례 카운트 업데이트
                document.getElementById('missing-count').textContent = missingCount;
                document.getElementById('witness-count').textContent = witnessCount;
            }

            // 초기 로딩 시 마커 로드
            loadMarkers();

            // 지도 크기 변경 시 중앙 위치 및 레벨 유지
            kakao.maps.event.addListener(map, 'idle', function() {
                // 필요한 경우 맵의 중앙 위치나 레벨을 조정하는 로직을 여기에 추가
            });
        });
    }
});