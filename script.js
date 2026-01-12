// 1. 배달 주소 설정 (사용자님이 발급받은 URL)
const GAS_URL = "https://script.google.com/macros/s/AKfycbwSL1uQrW8QBQWrnLpK_MeKUrNZdxFu_lDHkrDBkcNYsVzcH47UbXcwdAMaEk6gx97UiA/exec";

// 2. 화면 요소 가져오기
const searchForm = document.querySelector('.search-form');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const adultsInput = document.getElementById('adults');
const childrenInput = document.getElementById('children');

// 3. 날짜 자동 설정 (오늘 이전 날짜 선택 불가)
function initializeDateFields() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    
    if (checkinInput && checkoutInput) {
        checkinInput.min = today;
        checkinInput.value = today;
        checkoutInput.min = tomorrow;
        checkoutInput.value = tomorrow;
    }
}

// 4. 구글 시트로 데이터 쏘기
async function sendDataToSheet(e) {
    e.preventDefault(); // 버튼 눌러도 새로고침 안 되게 막음

    const btn = e.target.querySelector('.search-btn');
    btn.textContent = "데이터 전송 중..."; // 사용자에게 진행 상황 알림
    btn.disabled = true;

    // 보낼 데이터 상자 만들기
    const checkin = new Date(checkinInput.value);
    const checkout = new Date(checkoutInput.value);
    const stayDuration = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

    const formData = {
        logId: Date.now(),
        timestamp: new Date().toLocaleString('ko-KR'),
        checkin: checkinInput.value,
        checkout: checkoutInput.value,
        roomType: "Standard",
        adults: Number(adultsInput.value),
        children: Number(childrenInput.value),
        stayDuration: stayDuration
    };

    try {
        // 실제 전송
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        alert("시트에 예약 정보가 기록되었습니다!"); // 성공 알림
    } catch (error) {
        alert("전송에 실패했습니다. 다시 시도해 주세요.");
    } finally {
        btn.textContent = "검색하기";
        btn.disabled = false;
    }
}

// 5. 페이지 켜지자마자 실행
initializeDateFields();
if (searchForm) {
    searchForm.addEventListener('submit', sendDataToSheet);
}