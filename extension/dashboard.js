const ctx = document.getElementById('focusChart').getContext('2d');
const focusChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May'], // Example data
    datasets: [{
      label: 'Focus Time',
      data: [12, 19, 3, 5, 2], // Example data
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1
    }]
  }
});
