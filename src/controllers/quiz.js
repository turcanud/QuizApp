const generateQuestion = require('../../helpers/generateQuestionAI');

let correctQuestionIndex;

const quizAttempt = async (req, res) => {
    const { question, options, correctIndex } = await generateQuestion(1)
    correctQuestionIndex = correctIndex
    const plainQuestion = { question, "options": [...options], skill_level: 1 }
    res.json(plainQuestion)
}

const getQuestion = async (req, res) => {
    const { updatedSkillLevel } = req.body
    const { question, options, correctIndex } = await generateQuestion(updatedSkillLevel)
    correctQuestionIndex = correctIndex
    const plainQuestion = { "question": question, "options": [...options], updatedSkillLevel }
    res.json(plainQuestion)
}

const answerQuestion = async (req, res) => {
    //Recives answer from the user
    const { answerNumber, updatedSkillLevel } = req.body;

    //Check if correct or wrong
    if (answerNumber == correctQuestionIndex) {
        res.json({ message: 'Correct!', correctIndex: correctQuestionIndex, selected: answerNumber, skill_level: Math.min(updatedSkillLevel + 1, 10) });
    }
    else {
        res.json({ message: 'Wrong!', correctIndex: correctQuestionIndex, selected: answerNumber, skill_level: Math.max(updatedSkillLevel - 1, 1) });
    }
}

module.exports = {
    quizAttempt,
    getQuestion,
    answerQuestion
};