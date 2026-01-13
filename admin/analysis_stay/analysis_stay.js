const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initStayAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        const stayCounts = { '1박': 0, '2박': 0, '3박': 0, '4박 이상': 0 };
        let totalStay = 0;

        data.forEach(item => {
            const stay = parseInt(item.stayDuration || 1);
            totalStay += stay;

            if (stay === 1) stayCounts['1박']++;
            else if (stay === 2) stayCounts['2박']++;
            else if (stay === 3) stayCounts['3박']++;
            else stayCounts['4박 이상']++;
        });

        const avg = (totalStay / data.length).toFixed(1);
        document.getElementById('avg-stay-duration').innerText = `${avg}박`;

        renderChart(stayCounts);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

function renderChart(counts) {
    const ctx = document.getElementById('stayChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // 숙박 기간 분포를 보기 좋은 막대 차트
        data: {
            labels: Object.keys(counts),
            datasets: [{
                label: '조회 수',
                data: Object.values(counts),
                backgroundColor: '#10b981',
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

window.onload = initStayAnalysis;