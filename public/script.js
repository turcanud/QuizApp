//imports
import { fetchWithAuth } from './script/utils.js'

const loader = document.querySelector(".loader");

// Function to show loader
function showLoader() {
    loader.classList.remove("loader--hidden");
}

// Function to hide loader
function hideLoader() {
    loader.classList.add("loader--hidden");
}

window.addEventListener("load", () => {
    hideLoader(); // Hide loader when the window is loaded
});

const startButtonsContainer = document.querySelector('.btns-container');
const quizContainer = document.querySelector('#game');

const playButton = document.querySelector('#play-btn');
const nextButton = document.querySelector('#next-btn');
const checkButton = document.querySelector('#check-btn');
const skipButton = document.querySelector('#skip-btn');
const restartButton = document.querySelector('#restart-btn');
const finishButton = document.querySelector('#finish-btn');

let currentQuestionIndex;

let scorePoints;
let skipped;
let wrong;
const scoreElement = document.querySelector('#score');
const skippedElement = document.querySelector('#skipped');
const wrongElement = document.querySelector('#wrong');

let currentSkillLevel;

//Main
(async () => {
    scoreElement.classList.add('hidden')
    skippedElement.classList.add('hidden')
    wrongElement.classList.add('hidden')

    //Start Quiz
    playButton.addEventListener('click', async () => {
        await showLoader();
        const quizAttempt = await fetchWithAuth('/attempt', "GET");
        await hideLoader();
        await startTimer()
        startButtonsContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        restartButton.classList.add('hidden');
        scoreElement.classList.remove('hidden')
        skippedElement.classList.remove('hidden')
        wrongElement.classList.remove('hidden')
        currentSkillLevel = quizAttempt.skill_level;
        await startGame(quizAttempt);
    })

    //Next question
    nextButton.addEventListener('click', async () => {
        await showLoader();
        const question = await fetchWithAuth('/question', "POST", { updatedSkillLevel: currentSkillLevel });
        await hideLoader();
        skipButton.disabled = false;
        await nextQuestion(question)
    })

    //Check question
    checkButton.addEventListener('click', async () => {
        skipButton.disabled = true;
        const checkedInput = document.querySelector("input[type='radio']:checked")
        const orderNumber = checkedInput.getAttribute('data-order')
        await showLoader();
        const result = await fetchWithAuth('/answer', "POST", { answerNumber: orderNumber, updatedSkillLevel: currentSkillLevel })
        await hideLoader();
        currentSkillLevel = result.skill_level
        console.log('after check : ', result);
        await checkQuestion(result);
    })

    //Skip question
    skipButton.addEventListener('click', async () => {
        await showLoader();
        const question = await fetchWithAuth('/question', "POST", { updatedSkillLevel: currentSkillLevel });
        await hideLoader();
        skipped++;
        await nextQuestion(question);
    })

    //Finish quiz
    finishButton.addEventListener('click', async () => {
        await finishQuiz()
    })

    //Restart quiz
    restartButton.addEventListener('click', async () => {
        await showLoader();
        const quizAttempt = await fetchWithAuth('/attempt', "GET");
        await hideLoader();
        await startTimer()
        await restartQuiz();
        await startGame(quizAttempt);
    })

})();

//Start game
async function startGame(question) {
    currentQuestionIndex = 0;
    scorePoints = 0;
    skipped = 0;
    wrong = 0;

    scoreElement.textContent = `Score: 0/10`
    skippedElement.textContent = `Skipped: 0/10`
    wrongElement.textContent = `Wrong: 0/10`

    restartButton.disabled = true

    nextButton.disabled = true
    checkButton.disabled = false
    await showQuestion(question);
}

//Next question
async function nextQuestion(question) {

    currentQuestionIndex++

    if (currentQuestionIndex > 10) {
        return await finishQuiz()
    }
    skippedElement.textContent = `Skipped: ${skipped}/10`

    checkButton.disabled = false
    nextButton.disabled = true

    await showQuestion(question)
}

//Show Question
const optionsContainer = document.querySelector('#options-container')
const questionElement = document.querySelector('#question')
async function showQuestion(question) {
    //Clear last options
    await reset();

    //Inputing question and answer choices
    questionElement.textContent = question.question
    question.options.forEach((option, index) => {
        const input = document.createElement('input');
        input.type = 'radio'; input.name = 'question-choice'; input.value = option;
        input.setAttribute('data-order', index)

        const label = document.createElement('label');
        label.textContent = option;
        label.setAttribute('data-order', index)

        optionsContainer.appendChild(input)
        optionsContainer.appendChild(label)
    });
}

//Check question if correct or not
async function checkQuestion(result) {

    if (result.message === 'Correct!') {
        scorePoints++;
        scoreElement.textContent = `Score: ${scorePoints}/10`
        document.querySelector(`label[data-order='${result.correctIndex}']`).classList.add('correct')
    }
    else {
        document.querySelector(`label[data-order='${result.selected}']`).classList.add('wrong')
        document.querySelector(`label[data-order='${result.correctIndex}']`).classList.add('correct')
        wrong++
        wrongElement.textContent = `Wrong: ${wrong}/10`
    }
    await lockAnswer()
}

//Lock in the selected answer
async function lockAnswer() {
    const allInputs = document.querySelectorAll("input[type='radio']")
    allInputs.forEach((input) => {
        input.disabled = true
    })
    checkButton.disabled = true
    nextButton.disabled = false
}

//Clear old question container
async function reset() {
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild)
    }
}

// Finishing quiz
async function finishQuiz() {
    await stopTimer()
    questionElement.classList.add('hidden')
    nextButton.classList.add('hidden')
    checkButton.classList.add('hidden')
    skipButton.classList.add('hidden')
    finishButton.classList.add('hidden')
    restartButton.classList.remove('hidden');
    restartButton.disabled = false
    return document.location.href = "/quiz";
}

async function restartQuiz() {
    nextButton.classList.remove('hidden')
    checkButton.classList.remove('hidden')
    skipButton.classList.remove('hidden')
    finishButton.classList.remove('hidden')
    questionElement.classList.remove('hidden')
    await reset();
}

//Timer
const timerDisplay = document.querySelector('#timer-display')
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
