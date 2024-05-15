const express = require('express');

const userRouter = require('./routes/user')
const serveStatic = require('serve-static');
const path = require('path');

const questions = require('./data');

const app = express();

// Serve static files from the 'public' directory
app.use(serveStatic(path.join(__dirname, '../public')));

// connect to mongoBD
//...

//.env file config
require('dotenv').config();

// Allow json
app.use(express.json())

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

//Getting questions from OpenAI API
//...
app.get('/quizAttempt', async (req, res) => {
    const { question, options, skill_level } = questions.find(question => question.skill_level >= 1);
    const plainQuestion = { "question": question, "options": [...options], skill_level }
    res.json(plainQuestion)
})

app.post('/question', async (req, res) => {
    const { updatedSkillLevel } = req.body
    const { question, options } = questions.find(question => question.skill_level >= updatedSkillLevel);
    const plainQuestion = { "question": question, "options": [...options], updatedSkillLevel }
    res.json(plainQuestion)
})

app.post('/answer', async (req, res) => {
    //Recives answer from the user
    const { answerNumber, updatedSkillLevel } = req.body;
    const { scores, skill_level } = questions.find(question => question.skill_level == updatedSkillLevel);

    const correctIndex = scores.findIndex(score => score == 1);

    //Check if correct or wrong
    if (answerNumber == correctIndex) {
        res.json({ message: 'Correct!', correctIndex, selected: answerNumber, skill_level: Math.min(skill_level + 1, 10) });
    }
    else {
        res.json({ message: 'Wrong!', correctIndex, selected: answerNumber, skill_level: Math.max(skill_level - 1, 1) });
    }
})

// User
app.use('/user', userRouter)

app.listen(3000, () => {
    console.log('listening on port http://localhost:3000/');
})