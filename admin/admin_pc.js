const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initPCDashboard() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        // 1. 상단 KPI 및 기본 통계 계산
        updateSummary(data);
        
        // 2. 각 차트 렌더링
        renderDateChart(data);   
        renderRoomChart(data);   // roomType 필드 적용
        renderTimeline(data);    // 실시간 로그 에러 해결
        renderGuestChart(data);  
        renderLeadChart(data);   
        renderStayChart(data);   

        document.getElementById('last-update').innerText = `최종 업데이트: ${new Date().toLocaleString()}`;
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

// --- [요약 지표 로직] ---
function updateSummary(data) {
    document.getElementById('total-count').innerText = `${data.length}건`;
    
    let totalLead = 0;
    let totalStay = 0;
    data.forEach(item => {
        const lead = Math.ceil((new Date(item.checkin) - new Date(item.timestamp.split('.')[0])) / (1000*60*60*24));
        if (lead > 0) totalLead += lead;
        // stayDuration 필드 유지
        totalStay += parseInt(item.stayDuration || 1);
    });

    document.getElementById('avg-lead').innerText = `${Math.round(totalLead/data.length)}일`;
    document.getElementById('avg-stay').innerText = `${(totalStay/data.length).toFixed(1)}박`;
    document.getElementById('top-day').innerText = "분석 완료";
}

// --- [1순위: 수요 예측 차트] ---
function renderDateChart(data) {
    const counts = {};
    data.forEach(item => { counts[item.checkin] = (counts[item.checkin] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 10);

    new Chart(document.getElementById('dateChart'), {
        type: 'bar',
        data: {
            labels: sorted.map(x => x[0]),
            datasets: [{ label: '조회수', data: sorted.map(x => x[1]), backgroundColor: '#3b82f6' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- [2순위: 객실 선호도 차트 - roomType 적용] ---
function renderRoomChart(data) {
    const counts = {};
    data.forEach(item => { 
        // roomName 대신 roomType 사용
        const rType = item.roomType || "기타";
        counts[rType] = (counts[rType] || 0) + 1; 
    });

    new Chart(document.getElementById('roomChart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{ data: Object.values(counts), backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f87171'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- [3순위: 실시간 타임라인 - roomType 적용] ---
function renderTimeline(data) {
    const container = document.getElementById('pc-log-timeline');
    // 최신순 정렬 후 15개 표시
    const sortedData = [...data].reverse().slice(0, 15);
    
    container.innerHTML = sortedData.map(item => `
        <div class="log-item" style="padding: 10px; border-bottom: 1px solid #eee;">
            <span style="color: #3b82f6; font-weight:bold;">[${item.roomType || '알 수 없음'}]</span> 
            ${item.checkin} (${item.stayDuration}박)
            <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 4px;">조회일시: ${item.timestamp}</div>
        </div>
    `).join('');
}

// --- [4순위: 고객군 분석] ---
function renderGuestChart(data) {
    let adults = 0, children = 0;
    data.forEach(item => { 
        adults += parseInt(item.adults || 0); 
        children += parseInt(item.children || 0); 
    });

    new Chart(document.getElementById('guestChart'), {
        type: 'pie',
        data: {
            labels: ['성인', '아동'],
            datasets: [{ data: [adults, children], backgroundColor: ['#2563eb', '#fbbf24'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- [5순위: 리드타임 분석] ---
function renderLeadChart(data) {
    const groups = { '당일':0, '1주전':0, '2주전':0, '한달이상':0 };
    data.forEach(item => {
        const lead = Math.ceil((new Date(item.checkin) - new Date(item.timestamp.split('.')[0])) / (1000*60*60*24));
        if (lead <= 1) groups['당일']++;
        else if (lead <= 7) groups['1주전']++;
        else if (lead <= 14) groups['2주전']++;
        else groups['한달이상']++;
    });

    new Chart(document.getElementById('leadChart'), {
        type: 'line',
        data: {
            labels: Object.keys(groups),
            datasets: [{ label: '예약 건수', data: Object.values(groups), borderColor: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)', fill: true, tension: 0.4 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- [6순위: 숙박 기간 분석] ---
function renderStayChart(data) {
    const counts = { '1박': 0, '2박': 0, '3박+': 0 };
    data.forEach(item => {
        const s = parseInt(item.stayDuration || 1);
        if (s === 1) counts['1박']++; 
        else if (s === 2) counts['2박']++; 
        else counts['3박+']++;
    });

    new Chart(document.getElementById('stayChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{ label: '숙박 건수', data: Object.values(counts), backgroundColor: '#10b981' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

window.onload = initPCDashboard;