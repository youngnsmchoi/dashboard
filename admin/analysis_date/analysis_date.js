// 확인된 사용자님의 최신 GAS URL 적용
const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initDateAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        // 데이터 총 개수 표시
        document.getElementById('total-count').textContent = `${data.length}건`;

        // 1. 날짜 빈도수 계산
        const dateCounts = {};
        data.forEach(item => {
            const checkin = item.checkin;
            if(checkin) {
                dateCounts[checkin] = (dateCounts[checkin] || 0) + 1;
            }
        });

        // 2. 내림차순 정렬 후 상위 10개 추출
        const sortedDates = Object.entries(dateCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        renderDateChart(sortedDates);
    } catch (error) {
        console.error("날짜 데이터 로드 실패:", error);
        document.getElementById('total-count').textContent = "오류 발생";
    }
}

function renderDateChart(sortedDates) {
    const ctx = document.getElementById('dateChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: sortedDates.map(d => d[0]), // 날짜
            datasets: [{
                label: '검색 횟수',
                data: sortedDates.map(d => d[1]), // 빈도수
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y', // 모바일 가독성을 위해 가로 막대형 사용
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true, grid: { display: false } },
                y: { grid: { display: false } }
            }
        }
    });
}

window.onload = initDateAnalysis;