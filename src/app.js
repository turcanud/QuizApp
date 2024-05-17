const express = require('express');

const userRouter = require('./routes/user')
const quizRouter = require('./routes/quiz')
const serveStatic = require('serve-static');
const path = require('path');


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


// Quiz
app.use(quizRouter)
// User
app.use('/user', userRouter)

app.listen(3000, () => {
    console.log('listening on port http://localhost:3000/');
})