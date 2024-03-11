// Initialize score
let score = localStorage.getItem('score');
score = score ? parseFloat(score) : 0.0;

// Display score
document.getElementById('scoreDisplay').textContent = score;

// Save score
localStorage.setItem('score', score);