document.addEventListener('DOMContentLoaded', function () {
    const strayPostsContainer = document.getElementById('stray-posts-container');
    
    // ----------------------------------------------------
    // 1. 유기동물 데이터 (API 대체용 더미 데이터)
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
            status: "보호중"
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
        {
            id: 4,
            image: "https://via.placeholder.com/400x250?text=Pomeranian",
            breed: "포메라니안",
            gender: "수컷",
            age: "추정 1세",
            color: "흰색",
            weight: "약 3kg",
            foundDate: "2025-10-14",
            foundLocation: "광주광역시 남구 주월동",
            shelterName: "광주광역시 동물보호센터",
            shelterContact: "062-123-4567",
            status: "보호중"
        }
        // 실제 API 연동 시 이 배열은 fetch()를 통해 채워집니다.
    ];

    // ----------------------------------------------------
    // 2. 카드 생성 및 렌더링 함수
    // ----------------------------------------------------
    
    function getStatusTag(status) {
        if (status === '보호중') {
            return `<span class="status-tag tag-protected">보호중</span>`;
        } else if (status === '입양대기') {
            return `<span class="status-tag tag-waiting">입양대기</span>`;
        }
        return '';
    }

    function createAnimalCard(animal) {
        return `
            <div class="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition duration-300">
                <div class="w-full h-48 overflow-hidden">
                    <img src="${animal.image}" alt="${animal.breed}" class="w-full h-full object-cover">
                </div>
                
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <h2 class="text-xl font-extrabold text-slate-900">${animal.breed}</h2>
                        ${getStatusTag(animal.status)}
                    </div>

                    <div class="space-y-1 text-sm text-slate-700 mb-5 border-b border-slate-100 pb-3">
                        <p><span class="text-slate-500 mr-2">성별:</span> ${animal.gender}</p>
                        <p><span class="text-slate-500 mr-2">나이:</span> ${animal.age}</p>
                        <p><span class="text-slate-500 mr-2">색상:</span> ${animal.color}</p>
                        <p><span class="text-slate-500 mr-2">체중:</span> ${animal.weight}</p>
                        
                        <p class="flex items-center pt-2 text-slate-600">
                             <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ${animal.foundDate} 발견
                        </p>
                        <p class="flex items-center text-slate-600">
                            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            ${animal.foundLocation}
                        </p>
                    </div>

                    <div class="text-xs text-slate-500 mb-5">
                        <p>${animal.shelterName}</p>
                        <p class="flex items-center mt-1">
                            <svg class="info-icon" style="width: 0.8rem; height: 0.8rem; color: #f472b6;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.02 11.02 0 005.496 5.496l1.128-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.742 20 4 14.258 4 7V5z"></path></svg>
                            ${animal.shelterContact}
                        </p>
                    </div>
                    
                    <button class="w-full py-2 text-base font-bold text-pink-500 border-2 border-pink-500 rounded-lg hover:bg-pink-50 transition-colors">
                        상세정보 보기
                    </button>
                </div>
            </div>
        `;
    }

    function renderAnimals() {
        strayPostsContainer.innerHTML = '';
        
        if (strayAnimals.length === 0) {
            strayPostsContainer.innerHTML = '<div class="lg:col-span-3 text-center text-slate-500 p-8 border border-slate-200 rounded-xl">현재 공고된 유기동물이 없습니다.</div>';
            return;
        }

        strayAnimals.forEach(animal => {
            strayPostsContainer.innerHTML += createAnimalCard(animal);
        });
        
        document.getElementById('loading-message')?.remove(); // 로딩 메시지 제거
    }

    // ----------------------------------------------------
    // 3. 페이지 로드 시 렌더링
    // ----------------------------------------------------
    renderAnimals(); 
});