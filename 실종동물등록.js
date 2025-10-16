document.addEventListener('DOMContentLoaded', function () {
    // --- 페이지 접근 제어 ---
    // 로그인 상태가 아니면 경고 후 메인 페이지(index.html)로 돌려보냅니다.
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        alert("로그인이 필요한 서비스입니다.");
        window.location.href = "main.html"; 
        return; 
    }

    // --- 사진 미리보기 기능 ---
    const photoInput = document.getElementById('pet-photo');
    const photoPreview = document.getElementById('photo-preview');
    const uploadPlaceholder = document.getElementById('photo-upload-placeholder');

    if (photoInput) {
        photoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPreview.src = e.target.result;
                    photoPreview.classList.remove('hidden');
                    if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 카카오맵 API 연동 (등록 페이지용) ---
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof kakao !== 'undefined') {
        kakao.maps.load(function() {
            const addressOutput = document.getElementById('address-output');
            
            const mapOption = { 
                center: new kakao.maps.LatLng(35.16006, 126.85143), // 초기 중심: 광주광역시청
                level: 4 
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            
            const geocoder = new kakao.maps.services.Geocoder();
            const marker = new kakao.maps.Marker({ 
                position: map.getCenter() 
            });
            marker.setMap(map);

            kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
                const latlng = mouseEvent.latLng; 
                marker.setPosition(latlng);

                geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
                        addressOutput.value = detailAddr;
                    } else {
                        addressOutput.value = "주소를 가져올 수 없습니다.";
                    }
                });
            });
        });
    }

    // --- 폼 제출 로직 ---
    const registrationForm = document.getElementById('lost-pet-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!photoInput.files || photoInput.files.length === 0) {
                alert("반드시 사진을 등록해야 합니다.");
                photoInput.focus();
                return;
            }
            const addressOutput = document.getElementById('address-output');
            if (!addressOutput.value || addressOutput.value === "주소를 가져올 수 없습니다.") {
                alert("지도에서 실종 장소를 선택해주세요.");
                return;
            }
            
            // 실제 서버로 보낼 FormData 객체 생성
            const formData = new FormData();
            formData.append('photo', photoInput.files[0]);
            formData.append('name', document.getElementById('pet-name').value);
            formData.append('breed', document.getElementById('pet-breed').value);
            formData.append('gender', document.querySelector('input[name="pet-gender"]:checked')?.value || '미상');
            formData.append('age', document.getElementById('pet-age').value);
            formData.append('features', document.getElementById('pet-features').value);
            formData.append('lostDate', document.getElementById('lost-date').value);
            formData.append('lostLocation', addressOutput.value);
            formData.append('contact', document.getElementById('owner-contact').value);
            formData.append('useSafeNumber', document.getElementById('safe-number').checked);

            // 콘솔에 제출 데이터 출력 (테스트용)
            console.log("서버로 제출될 데이터:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            
            alert("실종 동물 정보가 성공적으로 등록되었습니다.\n(개발자 콘솔에서 전송된 데이터를 확인할 수 있습니다.)");
            
            // 실제 서버 전송 로직 예시 (주석 처리)
            /*
            fetch('/api/register-lost-pet', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = "index.html";
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("등록 중 오류가 발생했습니다.");
            });
            */
           
           // 테스트 완료 후 메인페이지로 이동
           window.location.href = "main.html";
        });
    }
});