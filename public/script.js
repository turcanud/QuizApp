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

//Main
(async () => {
    //Start Quiz
    playButton.addEventListener('click', async () => {
        const question = await fetchQuizData();
        await startGame(question);
    })

    //Next question
    nextButton.addEventListener('click', async () => {
        const question = await fetchQuizData();
        await nextQuestion(question)
    })

    //Check question
    checkButton.addEventListener('click', async () => {
        const checkedInput = document.querySelector("input[type='radio']:checked")
        const orderNumber = checkedInput.getAttribute('data-order')
        const answer = { answerNumber: orderNumber }
        const result = await fetch('/quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answer)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            })
        await checkQuestion(result);
    })

    //Skip question
    skipButton.addEventListener('click', async () => {
        skipped++
        await nextQuestion(shuffledQuestions)
    })

    //Finish quiz
    finishButton.addEventListener('click', async () => {
        await finishQuiz()
    })

    //Restart quiz
    restartButton.addEventListener('click', async () => {
        shuffledQuestions = await shuffle(shuffledQuestions)
        await restartQuiz();
        await startGame();
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

    startButtonsContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    restartButton.classList.add('hidden');
    restartButton.disabled = true

    nextButton.disabled = true
    checkButton.disabled = false
    await showQuestion(question);
}

//Next question
async function nextQuestion(question) {
    // if (currentQuestionIndex > 10) {
    //     return await finishQuiz()
    // }
    console.log(question);
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
    console.log(result);
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

// Finishing quiz
async function finishQuiz() {
    questionElement.classList.add('hidden')
    nextButton.classList.add('hidden')
    checkButton.classList.add('hidden')
    skipButton.classList.add('hidden')
    finishButton.classList.add('hidden')
    restartButton.classList.remove('hidden');
    restartButton.disabled = false
    await reset();
}

async function restartQuiz() {
    nextButton.classList.remove('hidden')
    checkButton.classList.remove('hidden')
    skipButton.classList.remove('hidden')
    finishButton.classList.remove('hidden')
    questionElement.classList.remove('hidden')
    await reset();
}

//Get data
async function fetchQuizData() {
    try {
        const response = await fetch('/quiz');
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
