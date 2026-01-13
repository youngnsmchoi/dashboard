const GAS_URL = "https://script.google.com/macros/s/AKfycbzhQHSgN4fjGO_XAs9Ha895whuHe5C2EB7FcvAABcX4_Fd5beg2yC5kVmbzyNmTu6yy_w/exec";

async function initRoomAnalysis() {
    try {
        const response = await fetch(GAS_URL);
        const data = await response.json();
        
        const roomCounts = {};
        data.forEach(item => {
            const room = item.roomType || "미지정";
            roomCounts[room] = (roomCounts[room] || 0) + 1;
        });

        const sortedRooms = Object.entries(roomCounts).sort((a, b) => b[1] - a[1]);

        renderChart(sortedRooms);
        renderList(sortedRooms);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

function renderChart(sortedRooms) {
    const ctx = document.getElementById('roomChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sortedRooms.map(r => r[0]),
            datasets: [{
                data: sortedRooms.map(r => r[1]),
                backgroundColor: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#cbd5e1']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            cutout: '65%'
        }
    });
}

function renderList(sortedRooms) {
    const listContainer = document.getElementById('room-list');
    listContainer.innerHTML = sortedRooms.map(([name, count]) => `
        <div class="room-item">
            <span class="room-name">${name}</span>
            <span class="room-count">${count}회 조회</span>
        </div>
    `).join('');
}

window.onload = initRoomAnalysis;