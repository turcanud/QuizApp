const startButtonsContainer = document.querySelector('.btns-container');
const quizContainer = document.querySelector('#game');

const playButton = document.querySelector('#play-btn');
const nextButton = document.querySelector('#next-btn');
const checkButton = document.querySelector('#check-btn');
const restartButton = document.querySelector('#restart-btn');

let currentQuestionIndex;
let questions;
let shuffledQuestions;

let scorePoints;
let skipped;
const scoreElement = document.querySelector('#score');
const skippedElement = document.querySelector('#skipped');

//Main
(async () => {
    //Getting questions data
    questions = await fetchQuizData()

    //Shuffled questions
    shuffledQuestions = await shuffle(questions)

    //Start Quiz
    playButton.addEventListener('click', async () => {
        await startGame();
    })

    //Next question
    nextButton.addEventListener('click', async () => {
        currentQuestionIndex++;

        checkButton.disabled = false
        nextButton.disabled = true

        if (shuffledQuestions.length < currentQuestionIndex) {
            skippedElement.classList.add('hidden')
            questionElement.classList.add('hidden')
        }

        await showQuestion(shuffledQuestions)
    })

    //Check question
    checkButton.addEventListener('click', async () => {
        await checkQuestion(shuffledQuestions[currentQuestionIndex])
    })

    //Restart quiz
    restartButton.addEventListener('click', async () => {
        shuffledQuestions = await shuffle(shuffledQuestions)
        await startGame();
    })

})();

//Start game
async function startGame() {
    currentQuestionIndex = 0;
    scorePoints = 0;
    skipped = 0;

    scoreElement.textContent = `Score: 0/10`

    startButtonsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    nextButton.disabled = true
    checkButton.disabled = false
    await showQuestion(questions);
}

//Show Question
const optionsContainer = document.querySelector('#options-container')
const questionElement = document.querySelector('#question')
async function showQuestion(questions) {
    //Clear last options
    await reset();

    //Inputing question and answer choices
    const currentQuestion = questions[currentQuestionIndex]
    questionElement.textContent = currentQuestion.question
    currentQuestion.options.forEach((option, index) => {
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
async function checkQuestion(question) {
    const checkedInput = document.querySelector("input[type='radio']:checked")
    const orderNumber = checkedInput.getAttribute('data-order')

    question.scores.forEach(async (score, index) => {
        if (score == 1 && index == orderNumber) {
            scorePoints++;
            scoreElement.textContent = `Score: ${scorePoints}/10`
            document.querySelector(`label[data-order='${index}']`).classList.add('correct')
        }
        else if (score != 1 && index == orderNumber) {
            document.querySelector(`label[data-order='${index}']`).classList.add('wrong')
            await showCorrectAnswer(question)
        }
    })
    await lockAnswer()
}

//Show correct answer if wrong
async function showCorrectAnswer(question) {
    question.scores.forEach(async (score, index) => {
        if (score == 1) {
            document.querySelector(`label[data-order='${index}']`).classList.add('correct')
        }
    })
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

//Get data
async function fetchQuizData() {
    try {
        const response = await fetch("./questions.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//Shuffle
async function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
