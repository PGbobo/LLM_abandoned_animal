document.addEventListener('DOMContentLoaded', function () {

    // --- Header, Modal, Login/Logout 관련 코드는 그대로 둡니다 ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            // 스크롤 시 헤더 그림자 추가/제거
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
    
    // 실종 동물 등록 페이지로 이동 전 로그인 체크 로직
    const registerLinks = document.querySelectorAll('a, button'); 
    registerLinks.forEach(link => {
        // href가 '실종동물등록.html'이거나 텍스트가 '실종 동물 등록'인 링크/버튼에 적용
        if (link.textContent.trim() === '실종 동물 등록' || link.getAttribute('href') === '실종동물등록.html') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (sessionStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '실종동물등록.html';
                } else {
                    alert("로그인이 필요한 서비스입니다.");
                    // 모달 창이 정의되어 있다면 열기
                    if (loginModal) openModal(loginModal);
                }
            });
        }
    });

    // --- Kakao Map (메인 페이지 지도) ---
    // 보호소.html에는 지도 컨테이너가 없으므로 이 블록은 실행되지 않습니다.
    const mapContainer = document.getElementById('map');

    if (mapContainer && typeof kakao !== 'undefined' && kakao.maps) {
        kakao.maps.load(function() {
            const mapOption = { 
                center: new kakao.maps.LatLng(35.1601, 126.8517),
                level: 7 
            };
            const map = new kakao.maps.Map(mapContainer, mapOption); 

            // (지도 마커 및 인포윈도우 로직은 생략)
            const positions = []; // 데이터는 여기에 포함되어야 함

            // 마커 생성 로직...
        }); 
    }
        
    updateNavUI(); 
});