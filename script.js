/**
 * 솔라시도 통합관리 - JavaScript 기능 통합본
 * 기존 기능(날짜 자동화, 검증, 로깅) + 구글 시트 전송 기능
 */

// 1. 구글 시트 배달 주소 (사용자님의 URL)
const GAS_URL = "https://script.google.com/macros/s/AKfycbwSL1uQrW8QBQWrnLpK_MeKUrNZdxFu_lDHkrDBkcNYsVzcH47UbXcwdAMaEk6gx97UiA/exec";

// =============================================
// 1. DOM 요소 불러오기
// =============================================
const searchForm = document.querySelector('.search-form');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const adultsInput = document.getElementById('adults');
const childrenInput = document.getElementById('children');

// =============================================
// 2. 날짜 관련 함수들 (기존 script_backup.js 로직 유지)
// =============================================

/** 오늘 날짜 반환 */
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/** 특정 날짜의 다음 날 계산 */
function getNextDay(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
}

/** 날짜 필드 초기화 */
function initializeDateFields() {
    const today = getTodayDate();
    const tomorrow = getNextDay(today);
    
    if (checkinInput && checkoutInput) {
        checkinInput.min = today;
        checkinInput.value = today;
        checkoutInput.min = tomorrow;
        checkoutInput.value = tomorrow;
    }
}

/** 체크인 날짜 변경 시 체크아웃 자동 조절 (핵심 기능) */
function setupCheckinDateHandler() {
    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('change', (e) => {
            const selectedCheckin = e.target.value;
            const nextDay = getNextDay(selectedCheckin);
            
            // 체크아웃의 최소 선택 가능 날짜를 체크인 다음날로 제한
            checkoutInput.min = nextDay;
            
            // 만약 현재 체크아웃 날짜가 새로운 체크인 날짜보다 빠르면 자동 변경
            if (checkoutInput.value <= selectedCheckin) {
                checkoutInput.value = nextDay;
            }
        });
    }
}

// =============================================
// 3. 데이터 수집 및 전송 함수 (통합본)
// =============================================

async function sendDataToSheet(e) {
    e.preventDefault();

    const btn = e.target.querySelector('.search-btn');
    const originalBtnText = btn.textContent;
    btn.textContent = "데이터 전송 중...";
    btn.disabled = true;

    // 데이터 수집
    const checkinVal = checkinInput.value;
    const checkoutVal = checkoutInput.value;
    const stayDuration = Math.ceil((new Date(checkoutVal) - new Date(checkinVal)) / (1000 * 60 * 60 * 24));

    const formData = {
        logId: Date.now(),
        timestamp: new Date().toLocaleString('ko-KR'),
        checkin: checkinVal,
        checkout: checkoutVal,
        roomType: "Standard",
        adults: Number(adultsInput.value),
        children: Number(childrenInput.value),
        stayDuration: stayDuration,
        화면크기: `${window.innerWidth} x ${window.innerHeight}` // 기존 백업본의 화면크기 수집 기능 포함
    };

    // 데이터 검증 (기존 로직 포함)
    const validation = validateFormData(formData);
    if (!validation.isValid) {
        alert(validation.message);
        btn.textContent = originalBtnText;
        btn.disabled = false;
        return;
    }

    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        alert("시트에 데이터가 성공적으로 기록되었습니다!");
    } catch (error) {
        console.error("전송 오류:", error);
        alert("전송에 실패했습니다.");
    } finally {
        btn.textContent = originalBtnText;
        btn.disabled = false;
    }
}

/** 데이터 검증 로직 (기존 백업본 유지) */
function validateFormData(formData) {
    if (!formData.checkin || !formData.checkout) {
        return { isValid: false, message: '날짜를 선택해주세요.' };
    }
    if (formData.checkin >= formData.checkout) {
        return { isValid: false, message: '체크아웃 날짜를 확인해주세요.' };
    }
    return { isValid: true, message: '검증 완료' };
}

// =============================================
// 4. 기타 유틸리티 및 로깅 (기존 백업본 유지)
// =============================================

function logPageInfo() {
    console.log('🌄 솔라시도 통합관리 로드 완료');
    console.log(`📍 페이지: ${window.location.href}`);
    console.log(`🖥️  화면 크기: ${window.innerWidth} x ${window.innerHeight}`);
    console.log('='.repeat(50));
}

// =============================================
// 5. 페이지 로드 시 초기화 실행
// =============================================

function initializePage() {
    initializeDateFields();      // 1. 날짜 초기화
    setupCheckinDateHandler();   // 2. 체크인 변경 이벤트 설정
    logPageInfo();               // 3. 페이지 정보 출력
    
    if (searchForm) {
        searchForm.addEventListener('submit', sendDataToSheet); // 4. 전송 이벤트 설정
    }
}

// 실행
initializePage();