const express = require('express');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/user')
const quizRouter = require('./routes/quiz')
const path = require('path');

const db = require('../helpers/db');

const { authenticateToken } = require('../helpers/authenticateToken');

const app = express();

app.use(cookieParser());

app.use(['/quiz'], authenticateToken);

app.use(express.static(path.join(__dirname, '../public')));

// connect to mongoBD
db.connect().then(() => {
    app.listen(3000, () => {
        console.log(`listening to http://localhost:3000/`);
    })
    console.log('Connected to database.');
}).catch(err => {
    console.error(err);
});

//.env file config
require('dotenv').config();

// Allow json
app.use(express.json())

// User
app.use(userRouter);

// Quiz
app.use(quizRouter);
