const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initEtcAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        // 유입 요일 분석 (기타 지표 예시)
        const dayCounts = { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0, '토': 0, '일': 0 };
        const week = ['일', '월', '화', '수', '목', '금', '토'];

        data.forEach(item => {
            const date = new Date(item.timestamp.split('.')[0]);
            const dayName = week[date.getDay()];
            dayCounts[dayName]++;
        });

        document.getElementById('etc-count').innerText = `${data.length}건 분석 완료`;

        renderChart(dayCounts);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

function renderChart(counts) {
    const ctx = document.getElementById('etcChart').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea', // 다채로운 분석을 위한 폴라 에어리어 차트
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: [
                    '#94a3b8', '#cbd5e1', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

window.onload = initEtcAnalysis;