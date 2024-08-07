let timer;
let totalTime = 10800; // 3 hours in seconds
let remainingTime = totalTime;
const timerDisplay = document.getElementById('time');

// Load saved time from localStorage if available
if (localStorage.getItem('remainingTime')) {
    remainingTime = parseInt(localStorage.getItem('remainingTime'), 10);
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    localStorage.setItem('remainingTime', remainingTime);
}

function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        localStorage.setItem('remainingTime', remainingTime);
        displayTime(remainingTime);
    } else {
        clearInterval(timer);
        saveCompletionTime();
        alert('Timer completed!');
    }
}

function displayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

function saveCompletionTime() {
    const now = new Date();
    fetch('/save-time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString()
        })
    });
}

// Reset timer at midnight
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        remainingTime = totalTime;
        localStorage.setItem('remainingTime', totalTime);
        displayTime(remainingTime);
    }
}, 60000); // check every minute

displayTime(remainingTime);
