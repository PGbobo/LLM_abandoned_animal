document.addEventListener('DOMContentLoaded', function () {

    // --- Header, Modal, Login/Logout 관련 코드는 그대로 둡니다 ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) header.classList.add('shadow-lg');
            else header.classList.remove('shadow-lg');
        });
    }

    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeLoginModalBtn = document.getElementById('close-login-modal');
    const closeSignupModalBtn = document.getElementById('close-signup-modal');
    const authButtons = document.getElementById('auth-buttons');
    const userActions = document.getElementById('user-actions');
    const logoutBtn = document.getElementById('logout-btn');
    const loginForm = document.querySelector('#login-modal form');
    
    let isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    function openModal(modal) { if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); } }
    function closeModal(modal) { if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); } }

    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));
    if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', () => closeModal(loginModal));
    if (closeSignupModalBtn) closeSignupModalBtn.addEventListener('click', () => closeModal(signupModal));
    if (loginModal) loginModal.addEventListener('click', (e) => { if (e.target === loginModal) closeModal(loginModal); });
    if (signupModal) signupModal.addEventListener('click', (e) => { if (e.target === signupModal) closeModal(signupModal); });

    const TEST_ID = "1234";
    const TEST_PASSWORD = "1234";

    function updateNavUI() {
        isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            if (authButtons) authButtons.classList.add('hidden');
            if (userActions) { userActions.classList.remove('hidden'); userActions.classList.add('flex'); }
        } else {
            if (authButtons) authButtons.classList.remove('hidden');
            if (userActions) { userActions.classList.add('hidden'); userActions.classList.remove('flex'); }
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const idInput = loginForm.querySelector('input[type="text"]');
            const pwInput = loginForm.querySelector('input[type="password"]');
            if (idInput.value.trim() === TEST_ID && pwInput.value.trim() === TEST_PASSWORD) {
                alert("로그인 성공!");
                sessionStorage.setItem('isLoggedIn', 'true');
                updateNavUI();
                closeModal(loginModal);
                idInput.value = "";
                pwInput.value = "";
            } else {
                alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            updateNavUI();
            alert("로그아웃 되었습니다.");
        });
    }
    
    const registerLinks = document.querySelectorAll('a, button'); 
    registerLinks.forEach(link => {
        if (link.textContent.trim() === '실종 동물 등록') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (sessionStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '실종동물등록.html';
                } else {
                    alert("로그인이 필요한 서비스입니다.");
                    openModal(loginModal);
                }
            });
        }
    });

    // --- Kakao Map (메인 페이지 지도) ---
    const mapContainer = document.getElementById('map');

    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // 바로 이 부분이 수정되었습니다.
    // 기존 if (mapContainer) { ... } 코드는 동일하지만,
    // 그 안의 모든 지도 관련 코드를 kakao.maps.load()로 감쌌습니다.
    if (mapContainer) {
        kakao.maps.load(function() {
            const mapOption = { 
                center: new kakao.maps.LatLng(35.1601, 126.8517),
                level: 7 
            };
            const map = new kakao.maps.Map(mapContainer, mapOption); 

            const positions = [
                {
                    title: '푸들',
                    latlng: new kakao.maps.LatLng(35.1384, 126.8427),
                    status: '실종',
                    date: '1시간 전',
                    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhalmPMX2psjXDU8BbhNuSGJjAuDwjUkvpPA&s'
                },
                {
                    title: '코숏',
                    latlng: new kakao.maps.LatLng(35.1488, 126.8774),
                    status: '실종',
                    date: '3시간 전',
                    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhalmPMX2psjXDU8BbhNuSGJjAuDwjUkvpPA&s'
                },
                {
                    title: '믹스견',
                    latlng: new kakao.maps.LatLng(35.1255, 126.8822),
                    status: '실종',
                    date: '8시간 전',
                    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhalmPMX2psjXDU8BbhNuSGJjAuDwjUkvpPA&s'
                }
            ];

            const missingMarkerImageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
            const protectedMarkerImageSrc = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png';
            const imageSize = new kakao.maps.Size(32, 35);

            const missingMarkerImage = new kakao.maps.MarkerImage(missingMarkerImageSrc, imageSize);
            const protectedMarkerImage = new kakao.maps.MarkerImage(protectedMarkerImageSrc, imageSize);

            positions.forEach(pos => {
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: pos.latlng,
                    title: pos.title,
                    image: (pos.status === '실종' ? missingMarkerImage : protectedMarkerImage)
                });

                const content = `
                    <div style="padding:10px; min-width:250px; font-family:'Inter', sans-serif;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${pos.img}" alt="${pos.title}" style="width:64px; height:64px; border-radius:8px; object-fit:cover;">
                            <div>
                                <div style="font-size:14px;">
                                    <span style="display:inline-block; padding:2px 8px; border-radius:16px; font-size:11px; font-weight:600; margin-right:5px; background-color:${pos.status === '실종' ? '#fee2e2' : '#dbeafe'}; color:${pos.status === '실종' ? '#dc2626' : '#2563eb'};">${pos.status}</span>
                                    <strong>${pos.title}</strong>
                                </div>
                                <div style="font-size:12px; color:#666; margin-top:4px;">${pos.date}</div>
                                <a href="#" style="font-size:12px; color:#0ea5e9; font-weight:600; margin-top:6px; display:block; text-decoration:none;">자세히 보기</a>
                            </div>
                        </div>
                    </div>`;

                const infowindow = new kakao.maps.InfoWindow({
                    content: content,
                    removable: true
                });
                
                kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });
            });
        }); // kakao.maps.load() 끝
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
    
    updateNavUI(); 
});