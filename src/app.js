const express = require('express');

const userRouter = require('./routes/user')
const quizRouter = require('./routes/quiz')
const serveStatic = require('serve-static');
const path = require('path');

const db = require('../helpers/db');

const { authenticateToken } = require('../helpers/authenticateToken');

const app = express();

// Serve static files from the 'public' directory
app.use(serveStatic(path.join(__dirname, '../public')));

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


app.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

app.get('/', authenticateToken, async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
// User
app.use(userRouter);

// Quiz
app.use(quizRouter);
