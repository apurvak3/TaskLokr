// Sample data for charts (in a real implementation, this would come from your API)
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const focusData = [2.5, 3.2, 1.8, 4.0, 2.7, 1.2, 0.5];

// Check focus status from the backend
async function checkFocusStatus() {
  try {
    const res = await fetch("http://localhost:5000/focus/last");
    const data = await res.json();

    const dot = document.getElementById("dashStatusDot");
    const text = document.getElementById("dashStatusText");

    if (data && data.endTime === null) {
      // Still running
      dot.classList.remove("red");
      dot.classList.add("green");
      text.textContent = "ON";
    } else {
      // No active session
      dot.classList.remove("green");
      dot.classList.add("red");
      text.textContent = "OFF";
    }
  } catch (err) {
    console.error("Failed to fetch focus status:", err);
  }
}

// Function to format time from minutes to hours and minutes
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

// Initialize charts
function initializeCharts() {
  // Weekly Focus Chart
  const weeklyChartCtx = document.getElementById('weeklyChart').getContext('2d');
  new Chart(weeklyChartCtx, {
    type: 'bar',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'Hours Focused',
        data: focusData,
        backgroundColor: '#4285f4',
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Hours'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  // Distribution Chart
  const distributionChartCtx = document.getElementById('distributionChart').getContext('2d');
  new Chart(distributionChartCtx, {
    type: 'doughnut',
    data: {
      labels: ['Morning', 'Afternoon', 'Evening', 'Night'],
      datasets: [{
        data: [30, 40, 20, 10],
        backgroundColor: ['#4285f4', '#48bf91', '#f4b400', '#db4437'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

// Update statistics display
function updateStats() {
  // In a real implementation, this would fetch data from your API
  document.getElementById('todayFocus').textContent = formatTime(185); // 3h 5m
  document.getElementById('weekFocus').textContent = formatTime(915); // 15h 15m
  document.getElementById('longestSession').textContent = formatTime(240); // 4h 0m
}

// Populate history table with sample data
function populateHistoryTable() {
  const tableBody = document.getElementById('historyTableBody');
  
  // Sample data - in a real implementation, this would come from your API
  const historyData = [
    { date: '2025-04-23', startTime: '09:30 AM', duration: '2h 15m', status: 'completed' },
    { date: '2025-04-22', startTime: '02:45 PM', duration: '1h 30m', status: 'completed' },
    { date: '2025-04-22', startTime: '10:00 AM', duration: '45m', status: 'interrupted' },
    { date: '2025-04-21', startTime: '08:15 AM', duration: '3h 0m', status: 'completed' },
    { date: '2025-04-20', startTime: '03:30 PM', duration: '1h 15m', status: 'completed' }
  ];
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add new rows
  historyData.forEach(session => {
    const row = document.createElement('tr');
    
    const dateCell = document.createElement('td');
    dateCell.textContent = session.date;
    
    const startTimeCell = document.createElement('td');
    startTimeCell.textContent = session.startTime;
    
    const durationCell = document.createElement('td');
    durationCell.textContent = session.duration;
    
    const statusCell = document.createElement('td');
    const statusSpan = document.createElement('span');
    statusSpan.className = session.status === 'completed' ? 'status-complete' : 'status-interrupted';
    statusSpan.textContent = session.status.charAt(0).toUpperCase() + session.status.slice(1);
    statusCell.appendChild(statusSpan);
    
    row.appendChild(dateCell);
    row.appendChild(startTimeCell);
    row.appendChild(durationCell);
    row.appendChild(statusCell);
    
    tableBody.appendChild(row);
  });
}

// Initialize the dashboard
function initializeDashboard() {
  checkFocusStatus();
  updateStats();
  initializeCharts();
  populateHistoryTable();
}

// Run when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Refresh focus status periodically
setInterval(checkFocusStatus, 30000); // Check every 30 seconds

