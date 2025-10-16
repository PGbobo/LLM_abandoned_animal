document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('map');
    const locationInput = document.getElementById('location');
    const fileDropArea = document.getElementById('file-drop-area');
    const photoUpload = document.getElementById('photo-upload');
    const fileList = document.getElementById('file-list');

    // ----------------------------------------------------
    // 1. 카카오맵 초기화 및 주소 검색 기능
    // ----------------------------------------------------

    if (mapContainer && typeof kakao !== 'undefined' && kakao.maps) {
        kakao.maps.load(function() {
            // 지도 초기 설정 (광주 중심)
            const mapOption = { 
                center: new kakao.maps.LatLng(35.1601, 126.8517), // 광주광역시 시청 근처 좌표
                level: 5 // 지도 확대 레벨
            };
            const map = new kakao.maps.Map(mapContainer, mapOption); 
            const geocoder = new kakao.maps.services.Geocoder();
            let marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(0, 0) });
            let isMarkerSet = false;

            // 주소 검색 및 마커 표시 함수
            function searchAndSetMarker(address) {
                if (!address.trim()) return;

                geocoder.addressSearch(address, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                        // 마커 설정 (파란색 마커 파일이 404 에러가 났으므로 기본 마커를 사용하거나, 다른 방법으로 대체합니다. 여기서는 기본 마커를 사용합니다.)
                        marker.setMap(null); // 기존 마커 제거
                        marker = new kakao.maps.Marker({
                            map: map,
                            position: coords,
                            // 콘솔 에러에 따라 marker_blue.png 대신 기본 마커 사용
                        });
                        
                        map.setCenter(coords);
                        map.setLevel(3);
                        isMarkerSet = true;

                        // 성공 메시지 (선택 사항)
                        // console.log("마커가 성공적으로 등록되었습니다.");

                    } else {
                        // 실패 시 기존 마커 제거 및 메시지
                        marker.setMap(null);
                        isMarkerSet = false;
                        alert("주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.");
                    }
                });
            }

            // 'location' 입력 필드에서 Enter 키 또는 포커스가 벗어날 때 검색 실행
            locationInput.addEventListener('change', (e) => searchAndSetMarker(e.target.value));
            locationInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Enter 키로 폼 제출 방지
                    searchAndSetMarker(e.target.value);
                }
            });
        });
    }

    // ----------------------------------------------------
    // 2. 파일 업로드 기능 (드래그 앤 드롭)
    // ----------------------------------------------------

    // 클릭 시 파일 선택창 열기
    fileDropArea.addEventListener('click', () => {
        photoUpload.click();
    });

    // 파일 선택 이벤트 핸들러
    photoUpload.addEventListener('change', function() {
        handleFiles(this.files);
    });

    // 드래그 앤 드롭 이벤트 방지
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    // 드래그 오버 시 스타일 변경
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => {
            fileDropArea.classList.add('border-pink-500');
            fileDropArea.classList.remove('border-gray-300');
        }, false);
    });

    // 드래그 리브 시 스타일 복구
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, () => {
            fileDropArea.classList.remove('border-pink-500');
            fileDropArea.classList.add('border-gray-300');
        }, false);
    });

    // 드롭 이벤트 핸들러
    fileDropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        handleFiles(dt.files);
    }, false);

    // 파일 목록 표시
    function handleFiles(files) {
        fileList.innerHTML = ''; // 기존 목록 초기화
        if (files.length > 0) {
            let fileNames = '';
            for (let i = 0; i < files.length; i++) {
                fileNames += `<div class="flex justify-between items-center bg-gray-100 p-2 rounded mt-1">${files[i].name} <span class="text-xs text-pink-500 ml-2">(${Math.ceil(files[i].size / 1024)}KB)</span></div>`;
            }
            fileList.innerHTML = fileNames;
        }
    }
    
    // ----------------------------------------------------
    // 3. 폼 제출 (Form Submission) 로직
    // ----------------------------------------------------
    const reportForm = document.getElementById('animal-report-form');
    if(reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 여기에서 서버로 데이터를 전송하는 로직을 구현합니다.
            // 예시로 필수 항목이 모두 채워졌는지 확인하는 알림을 표시합니다.
            
            if (!locationInput.value.trim() || !document.getElementById('features').value.trim()) {
                 alert("필수 항목(*)인 특징과 목격 장소를 입력해주세요.");
                 return;
            }
            
            // 실제 구현에서는 AJAX/fetch를 사용하여 서버로 데이터를 보냅니다.
            alert("제보가 성공적으로 접수되었습니다! 감사합니다.");
            reportForm.reset();
            
            // 제출 후 지도 마커 및 파일 목록 초기화 (필요하다면)
            // if (isMarkerSet) marker.setMap(null); 
            // fileList.innerHTML = '';
        });
    }

});