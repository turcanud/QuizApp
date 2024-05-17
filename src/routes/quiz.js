//Getting predefined data
const router = require('express').Router();
const generateQuestion = require('../../helpers/generateQuestionAI');

let correctQuestionIndex;

router.get('/attempt', async (req, res) => {
    const { question, options, correctIndex } = await generateQuestion(1)
    correctQuestionIndex = correctIndex
    const plainQuestion = { question, "options": [...options], skill_level: 1 }
    res.json(plainQuestion)
})

router.post('/question', async (req, res) => {
    const { updatedSkillLevel } = req.body
    const { question, options, correctIndex } = await generateQuestion(updatedSkillLevel)
    correctQuestionIndex = correctIndex
    const plainQuestion = { "question": question, "options": [...options], updatedSkillLevel }
    res.json(plainQuestion)
})

router.post('/answer', async (req, res) => {
    //Recives answer from the user
    const { answerNumber, updatedSkillLevel } = req.body;

    //Check if correct or wrong
    if (answerNumber == correctQuestionIndex) {
        res.json({ message: 'Correct!', correctIndex: correctQuestionIndex, selected: answerNumber, skill_level: Math.min(updatedSkillLevel + 1, 10) });
    }
    else {
        res.json({ message: 'Wrong!', correctIndex: correctQuestionIndex, selected: answerNumber, skill_level: Math.max(updatedSkillLevel - 1, 1) });
    }
})

module.exports = router;