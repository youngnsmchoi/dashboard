const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initLeadAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        const leadCounts = { '당일': 0, '1~3일전': 0, '1주전': 0, '2주전': 0, '한달이상': 0 };
        let totalDays = 0;

        data.forEach(item => {
            const checkin = new Date(item.checkin);
            const searchDate = new Date(item.timestamp.split('.')[0]); // 시간 제외 날짜만
            
            const diffTime = checkin - searchDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 0) leadCounts['당일']++;
            else if (diffDays <= 3) leadCounts['1~3일전']++;
            else if (diffDays <= 7) leadCounts['1주전']++;
            else if (diffDays <= 14) leadCounts['2주전']++;
            else leadCounts['한달이상']++;

            if (diffDays > 0) totalDays += diffDays;
        });

        const avg = Math.round(totalDays / data.length);
        document.getElementById('avg-lead-time').innerText = `${avg}일`;

        renderChart(leadCounts);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

function renderChart(counts) {
    const ctx = document.getElementById('leadChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: '검색 횟수',
                data: Object.values(counts),
                backgroundColor: '#8b5cf6',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

window.onload = initLeadAnalysis;