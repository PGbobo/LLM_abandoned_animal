document.addEventListener('DOMContentLoaded', function () {
    // ----------------------------------------------------
    // [1] DOM 요소 및 관리자 설정
    // ----------------------------------------------------
    const strayPostsContainer = document.getElementById('stray-posts-container'); // 유기동물 조회 페이지의 컨테이너 ID
    
    // 유기동물 조회 페이지가 아닌 현재 메인 페이지에서 사용하기 위해 새로운 컨테이너 ID를 사용합니다.
    // 만약 이 코드를 메인 페이지에 적용한다면, 아래 주석을 해제하고 사용하세요.
    // const announcementList = document.querySelector('.announcement-list'); 
    
    // 관리자 기능 요소 (이전 코드에서 사용된 ID를 그대로 유지합니다. HTML 헤더에 해당 요소가 있어야 작동합니다.)
    const is_admin = true; // 🚩 관리자 권한 (테스트를 위해 true로 설정)
    const addStrayBtn = document.getElementById('add-stray-btn');
    const addStrayModal = document.getElementById('add-stray-modal');
    const closeAddStrayModal = document.getElementById('close-add-stray-modal');
    const addStrayForm = document.getElementById('add-stray-form');


    // ----------------------------------------------------
    // [2] 유기동물 데이터 (API 대체용 더미 데이터)
    // ----------------------------------------------------
    const strayAnimals = [
        {
            id: 1,
            image: "https://via.placeholder.com/400x250?text=Mixdog",
            breed: "믹스견",
            gender: "수컷",
            age: "추정 3세",
            color: "갈색",
            weight: "약 15kg",
            foundDate: "2025-10-05",
            foundLocation: "광주광역시 북구 용봉동",
            shelterName: "광주광역시 동물보호센터",
            shelterContact: "062-123-4567",
            status: "보호중" // 보호 -> protected, 입양대기 -> protected 로 간주합니다.
        },
        {
            id: 2,
            image: "https://via.placeholder.com/400x250?text=Koshot",
            breed: "코리안숏헤어",
            gender: "암컷",
            age: "추정 2세",
            color: "회색 태비",
            weight: "약 4kg",
            foundDate: "2025-10-08",
            foundLocation: "광주광역시 서구 화정동",
            shelterName: "광주광역시 동물보호센터",
            shelterContact: "062-123-4567",
            status: "보호중"
        },
        {
            id: 3,
            image: "https://via.placeholder.com/400x250?text=Golden+Retriever",
            breed: "골든 리트리버",
            gender: "암컷",
            age: "추정 5세",
            color: "황금색",
            weight: "약 28kg",
            foundDate: "2025-10-01",
            foundLocation: "광주광역시 동구 학동",
            shelterName: "광주광역시 동물보호센터",
            shelterContact: "062-123-4567",
            status: "입양대기"
        },
        // 메인 페이지 리스트 디자인을 위해 임시로 실종 상태 데이터 추가
        {
            id: 4,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhalmPMX2psjXDU8BbhNuSGJjAuDwjUkvpPA&s",
            breed: "푸들",
            gender: "수컷",
            age: "3살",
            color: "갈색",
            weight: "약 5kg",
            foundDate: "2025-10-16",
            foundLocation: "광주 서구 풍암호수공원",
            shelterName: "개인 보호자",
            shelterContact: "010-9876-5432",
            status: "실종" // 실종 -> missing 태그 사용을 위해 추가
        }
    ];

    // ----------------------------------------------------
    // [3] 카드 생성 및 렌더링 함수 (메인 페이지 디자인 적용)
    // ----------------------------------------------------
    
    function getStatusBadge(status) {
        const statusClass = status === '실종' ? 'missing' : 'protected';
        return `<span class="status-badge ${statusClass}">${status === '실종' ? '실종' : '보호'}</span>`;
    }

    function getTimeAgo(dateString) {
        const now = new Date();
        const foundDate = new Date(dateString);
        const diffInHours = Math.floor((now - foundDate) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}일 전`;
        }
    }

    // 메인 페이지의 '주변의 도움이 필요해요!' 리스트 아이템 디자인을 복사하여 사용
    function createAnimalListItem(animal) {
        const isMissing = animal.status === '실종';
        const borderColor = isMissing ? 'border-pink-200' : 'border-blue-200';
        const timeAgo = getTimeAgo(animal.foundDate);

        return `
            <div class="bg-white p-3 rounded-xl shadow border ${borderColor} flex items-center gap-3">
                <img src="${animal.image}" alt="${animal.breed}" class="w-24 h-24 rounded-lg object-cover flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-base">${animal.breed} / ${animal.age}</h3>
                    <p class="text-slate-600 text-xs mt-1">
                        ${getStatusBadge(animal.status)} 
                        <span class="text-slate-600">${animal.foundLocation}</span>
                    </p>
                    <p class="text-slate-400 text-xs mt-1">${timeAgo}</p>
                    <button class="text-xs text-pink-500 font-medium mt-1 hover:underline" data-id="${animal.id}">상세보기</button>
                </div>
            </div>
        `;
    }

    // 초기 및 업데이트 시 동물 목록을 렌더링하는 핵심 함수
    function renderAnimals(container, animals) {
        container.innerHTML = '';
        
        if (animals.length === 0) {
            container.innerHTML = '<div class="p-8 text-center text-slate-500 border border-slate-200 rounded-xl">현재 공고된 동물이 없습니다.</div>';
            return;
        }

        animals.forEach(animal => {
            container.innerHTML += createAnimalListItem(animal);
        });
    }

    // ----------------------------------------------------
    // [4] 관리자 등록 기능 연동 및 모달 제어
    // ----------------------------------------------------

    // 메인 페이지에서 로직을 실행할 경우:
    // **주의: 메인 페이지 HTML에는 유기동물 등록 모달(id="add-stray-modal") 요소와 버튼이 없습니다.**
    // 이 로직을 사용하려면, 이전 답변에서 제공된 "유기동물 등록 모달" HTML 요소를 메인 페이지에 추가해야 합니다.
    
    // 관리자 버튼 표시
    if (is_admin && addStrayBtn) {
        addStrayBtn.classList.remove('hidden');
    }

    // 모달 열기/닫기/제출 로직 (이전 코드와 동일)
    if (addStrayBtn && addStrayModal) {
        addStrayBtn.addEventListener('click', () => {
            addStrayModal.classList.remove('hidden');
            addStrayModal.classList.add('flex');
        });
        closeAddStrayModal.addEventListener('click', () => {
            addStrayModal.classList.add('hidden');
            addStrayModal.classList.remove('flex');
        });
        addStrayModal.addEventListener('click', (e) => {
            if (e.target === addStrayModal) {
                addStrayModal.classList.add('hidden');
                addStrayModal.classList.remove('flex');
            }
        });
    }

    // 등록 폼 제출 핸들러
    if (addStrayForm) {
        addStrayForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const imageFile = document.getElementById('animal-image').files[0];
            const imageUrl = imageFile 
                ? URL.createObjectURL(imageFile) 
                : "https://via.placeholder.com/400x250?text=New+Stray";

            const newAnimal = {
                id: Date.now(),
                image: imageUrl, 
                breed: document.getElementById('animal-kind').value,
                gender: document.getElementById('animal-gender').value,
                age: document.getElementById('animal-age').value,
                color: document.getElementById('animal-color').value,
                weight: document.getElementById('animal-weight').value,
                foundDate: document.getElementById('animal-date').value,
                foundLocation: document.getElementById('animal-location').value,
                shelterName: document.getElementById('animal-shelter').value,
                shelterContact: document.getElementById('animal-phone').value,
                status: document.getElementById('animal-status').value, // '보호중', '입양대기' 등
            };

            // 새 동물 데이터를 배열에 추가하고 화면을 새로 렌더링
            strayAnimals.unshift(newAnimal); // 새로 추가된 항목을 맨 앞에 표시
            
            // 메인 페이지 리스트에 렌더링
            const targetContainer = document.querySelector('.announcement-list'); 
            if (targetContainer) {
                renderAnimals(targetContainer, strayAnimals.filter(a => a.status !== '입양완료')); // '입양완료' 제외하고 렌더링 가정
            }
            
            console.log('유기동물 정보 등록 완료:', newAnimal);
            alert(`[${newAnimal.breed}] 유기동물 정보가 등록되었습니다.`);
            
            addStrayModal.classList.add('hidden');
            addStrayModal.classList.remove('flex');
            addStrayForm.reset();
        });
    }
    
    // ----------------------------------------------------
    // [5] 페이지 로드 시 초기 렌더링 실행
    // ----------------------------------------------------
    
    // 메인 페이지의 '주변의 도움이 필요해요!' 리스트에 렌더링
    const mainPageListContainer = document.querySelector('.announcement-list');
    if (mainPageListContainer) {
         // 기존 HTML 코드를 지우고 동적으로 생성
         renderAnimals(mainPageListContainer, strayAnimals.filter(a => a.status !== '입양완료'));
    } 
    
    // 유기동물 조회 페이지라면, 해당 컨테이너에도 렌더링 (필요하다면)
    if (strayPostsContainer) {
         // 유기동물 조회 페이지 로직 (이전 카드 디자인으로 렌더링 필요)
         // 여기서는 메인 페이지 디자인으로 통일하여 렌더링한다고 가정합니다.
         // renderAnimals(strayPostsContainer, strayAnimals.filter(a => a.status !== '실종')); // 유기동물 조회 페이지는 실종 제외
    }
});