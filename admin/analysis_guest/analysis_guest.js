const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initGuestAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        let totalAdults = 0;
        let totalChildren = 0;

        data.forEach(item => {
            totalAdults += parseInt(item.adults || 0);
            totalChildren += parseInt(item.children || 0);
        });

        renderChart(totalAdults, totalChildren);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

function renderChart(adults, children) {
    const ctx = document.getElementById('guestChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie', // 구성비 분석에 최적화된 파이 차트
        data: {
            labels: ['성인', '아동'],
            datasets: [{
                data: [adults, children],
                backgroundColor: ['#2563eb', '#fbbf24'], // 블루(성인) & 옐로우(아동)
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

window.onload = initGuestAnalysis;