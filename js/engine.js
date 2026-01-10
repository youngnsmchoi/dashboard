/* [라벨: 객실 데이터 설정] 시작 */
/* 홈페이지에 표시될 각 객실의 이름, 사진, 상세 설명을 저장하는 데이터 저장소입니다. */
const roomData = {
    "ocean": { 
        title: "Ocean Suite", 
        img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600", 
        desc: "파노라마 오션뷰와 함께하는 최고의 휴식." 
    },
    "forest": { 
        title: "Forest Villa", 
        img: "https://images.unsplash.com/photo-1578683010236-d716f9759678?q=80&w=600", 
        desc: "숲의 숨결을 그대로 느끼는 프라이빗 공간." 
    }
};
/* [라벨: 객실 데이터 설정] 끝 */

/* [라벨: 모달 팝업 제어 기능] 시작 */
// 상세 모달 열기
function openRoomDetail(id) {
    const room = roomData[id];
    const modal = document.getElementById("roomModal");
    const body = document.getElementById("modalBody");

    if (room && modal && body) {
        body.innerHTML = `
            <img src="${room.img}" style="width:100%; border-radius:8px; margin-bottom:15px;">
            <h2 style="font-size:1.2rem;">${room.title}</h2>
            <p style="margin-top:10px; line-height:1.6; color:#666; font-size:0.9rem;">${room.desc}</p>
        `;
        modal.style.display = "block";
    }
}

// 상세 모달 닫기
function closeModal() {
    document.getElementById("roomModal").style.display = "none";
}

// 모달 바깥쪽 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById("roomModal");
    if (event.target == modal) closeModal();
}
/* [라벨: 모달 팝업 제어 기능] 끝 */

/* [라벨: 실시간 공지사항 연동] 시작 */
/* 구글 시트에서 공지 내용을 가져와 화면에 표시합니다. */
/* engine.js 47행부터 75행까지(loadNotice 함수 전체)를 아래로 교체하세요 */
async function loadNotice() {
    // 1. 사장님 시트 ID (주소창에서 복사한 것)
    const SHEET_ID = '1FBV016dKrDNZ7vxkwF-BX7EqFMA2RWK7EKE86SoeKx0'; 
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    try {
        const res = await fetch(csvUrl);
        const data = await res.text();
        const rows = data.split('\n');
        const rowData = rows[1].split(',');

        // 2. 만약 공지가 B열에 있다면 rowData[1], A열에 있다면 rowData[0]을 쓰세요.
        // 현재 날짜가 나온다면 rowData[1]로 바꿔보세요.
        let noticeContent = rowData[1] || rowData[0]; 

        // 3. 상단 검은 바(#notice-text)를 정확히 찾아갑니다.
        const target = document.getElementById('notice-text');
        if (target && noticeContent) {
            target.innerText = noticeContent.trim();
        }
    } catch (e) {
        console.error("공지 로드 실패", e);
    }
}

async function loadNotice() {
    const SHEET_ID = '1FBV016dKrDNZ7vxkwF-BX7EqFMA2RWK7EKE86SoeKx0'; 
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    try {
        const res = await fetch(csvUrl);
        const data = await res.text();
        const rows = data.split('\n');
        
        // 2행 데이터를 가져와 콤마로 나눕니다.
        const rowData = rows[1].split(',');

        // [수정] 무조건 B열(index 1)만 가져오도록 고정합니다.
        // 사장님 시트의 B2 칸에 적힌 내용이 화면에 나옵니다.
        let noticeContent = rowData[1]; 

        const target = document.getElementById('notice-text');
        if (target && noticeContent) {
            // 양 끝 공백만 제거하고 그대로 출력합니다.
            target.innerText = noticeContent.trim();
        }
    } catch (e) {
        console.error("공지 로드 실패", e);
    }
}
/* [라벨: 실시간 공지사항 연동] 끝 */

/* [라벨: 이탈 방지 팝업 제어] 시작 */
/* 마우스가 화면 밖으로 나갈 때 딱 한 번만 팝업을 띄웁니다. */
function openExitPopup() {
    if (document.getElementById('exitModal')) return;

    const popupHtml = `
        <div id="exitModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;">
            <div style="background:#fff; width:90%; max-width:400px; border-radius:20px; padding:30px; text-align:center; position:relative; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <h2 style="color:#c5a059; font-size:1.5rem; margin-bottom:15px;">잠깐만요! 🎁</h2>
                <p style="font-size:1rem; line-height:1.6; color:#333; margin-bottom:20px;">
                    솔라시도를 이대로 떠나시나요?<br>
                    지금 예약 문의하시면 <b>바비큐 세트 무료 쿠폰</b>을 드립니다!
                </p>
                <button onclick="location.href='#'" style="background:#1a1a1a; color:#fff; border:none; padding:15px 30px; border-radius:10px; font-weight:bold; cursor:pointer; width:100%;">쿠폰 받고 예약하기</button>
                <p onclick="closeExitPopup()" style="margin-top:20px; color:#999; cursor:pointer; font-size:0.9rem; text-decoration:underline;">아니오, 나중에 할게요.</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function closeExitPopup() {
    const modal = document.getElementById('exitModal');
    if (modal) modal.remove();
}

// 마우스 이탈 감지 이벤트 리스너
document.addEventListener('mouseleave', (event) => {
    // Y축 좌표가 0보다 작거나 같고(화면 위쪽), 세션 기록이 없을 때 실행
    if (event.clientY <= 0 && !sessionStorage.getItem('hasSeenPopup')) {
        openExitPopup(); 
        sessionStorage.setItem('hasSeenPopup', 'true'); // 기록 저장하여 재실행 방지
    }
});
/* [라벨: 이탈 방지 팝업 제어] 끝 */

// 페이지 로드 시 공지사항 실행
window.onload = loadNotice;

/* [추가] 조회하기 버튼 클릭 시 실행되는 함수 */
function searchRooms() {
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;

  if (!checkin || !checkout) {
    alert('날짜를 선택해주세요.');
    return;
  }

  // 나중에 대시보드 기록을 위해 아래 문장을 남겨둡니다.
  console.log("조회 시도: " + checkin + " ~ " + checkout);
  alert('예약 가능한 객실을 조회합니다.');
}