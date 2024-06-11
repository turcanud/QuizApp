//Timer
let startTime;
let timerInterval;

async function updateTimerDisplay() {
    const currentTime = new Date().getTime();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

async function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

async function stopTimer() {
    clearInterval(timerInterval);
}