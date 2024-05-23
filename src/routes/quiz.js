const router = require('express').Router();
const { quizAttempt, getQuestion, answerQuestion } = require('../controllers/quiz');
const { authenticateToken } = require('../../helpers/authenticateToken');

router.get('/attempt', authenticateToken, quizAttempt);

router.post('/question', authenticateToken, getQuestion);

router.post('/answer', authenticateToken, answerQuestion);

module.exports = router;