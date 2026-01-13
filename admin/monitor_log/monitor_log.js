const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function fetchLogs() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        // 최신순 정렬 (logId 또는 timestamp 기준)
        const sortedData = data.reverse().slice(0, 50); 
        renderTimeline(sortedData);
    } catch (error) {
        console.error("로그 로드 실패:", error);
    }
}

function renderTimeline(logs) {
    const timeline = document.getElementById('log-timeline');
    
    if (logs.length === 0) {
        timeline.innerHTML = '<div class="loading">조회된 로그가 없습니다.</div>';
        return;
    }

    timeline.innerHTML = logs.map(log => `
        <div class="log-item">
            <span class="log-time">${log.timestamp}</span>
            <div class="log-content">
                객실 <b>${log.roomType}</b> 조회 발생
            </div>
            <div class="log-details">
                📅 일정: ${log.checkin} ~ ${log.checkout} (${log.stayDuration}박)<br>
                👥 인원: 성인 ${log.adults}, 아동 ${log.children}
            </div>
        </div>
    `).join('');
}

// 30초마다 자동 갱신 (실시간 느낌 부여)
setInterval(fetchLogs, 30000);
window.onload = fetchLogs;