// 1. 구글 시트 데이터 주소 (사용자님의 GAS URL)
const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";


async function initAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        // 총 데이터 개수 표시
        document.getElementById('total-count').textContent = `${data.length}건`;

        // 날짜 빈도수 측정 로직 (로드맵 1번 핵심 포인트)
        const dateCounts = {};
        data.forEach(row => {
            const checkin = row.checkin; // 'yyyy-mm-dd' 형식으로 통일된 데이터 사용
            dateCounts[checkin] = (dateCounts[checkin] || 0) + 1;
        });

        // 내림차순 정렬 후 상위 10개 추출
        const sortedData = Object.entries(dateCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        renderChart(sortedData);
    } catch (error) {
        console.error("데이터 분석 오류:", error);
        document.getElementById('total-count').textContent = "오류 발생";
    }
}

function renderChart(sortedData) {
    const ctx = document.getElementById('dateChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: sortedData.map(item => item[0]), // 날짜
            datasets: [{
                label: '검색 횟수',
                data: sortedData.map(item => item[1]), // 빈도수
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderRadius: 5
            }]
        },
        options: {
            indexAxis: 'y', // 모바일 스크롤 최적화: 가로 막대 방향
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

// 페이지 로드 시 시작
window.onload = initAnalysis;