const express = require('express');

const userRouter = require('./routes/user')
const serveStatic = require('serve-static');
const path = require('path');

const questions = require('./data');

let updatedSkillLevel = 1; // Initial skill level

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
app.get('/quiz', async (req, res) => {
    const { question, options } = questions.find(question => question.skill_level >= updatedSkillLevel);
    const plainQuestion = { "question": question, "options": [...options] }
    res.json(plainQuestion)
})

app.post('/quiz', async (req, res) => {
    const { scores, skill_level } = questions.find(question => question.skill_level >= updatedSkillLevel);
    //Recives answer from the user
    const { answerNumber } = req.body;

    const correctIndex = scores.findIndex(score => score == 1);

    //Check if correct or wrong
    if (answerNumber == correctIndex) {
        updatedSkillLevel = Math.min(skill_level + 1, 10);
        res.json({ message: 'Correct!', correctIndex, selected: answerNumber });
    }
    else {
        updatedSkillLevel = Math.max(skill_level - 1, 1);
        res.json({ message: 'Wrong!', correctIndex, selected: answerNumber });
    }
})

// User
app.use('/user', userRouter)

app.listen(3000, () => {
    console.log('listening on port http://localhost:3000/');
})