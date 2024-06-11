const generateQuestion = require('../../helpers/generateQuestionAI');
const QuizData = require('../models/quiz_data');

let correctQuestionIndex;

const quizAttempt = async (req, res) => {
    //Create attempt
    const quizData = new QuizData({
        user_id: req.user._id
    })

    await quizData.save()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        })
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
    const { answerNumber, updatedSkillLevel, questionId, questionText, timeTaken } = req.body;

    // Check if the answer is correct
    const isCorrect = answerNumber == correctQuestionIndex;
    const newSkillLevel = isCorrect ? Math.min(updatedSkillLevel + 1, 10) : Math.max(updatedSkillLevel - 1, 1);
    const stateAnswer = isCorrect ? 'correct' : 'wrong';

    try {
        // Find the latest quiz attempt by the user
        const quizData = await QuizData.findOne({ user_id: req.user._id }).sort({ createdAt: -1 });

        // Update the quiz data
        quizData.questions_data.push({
            question_id: questionId,
            question: questionText,
            state_answer: stateAnswer,
            level: updatedSkillLevel,
            time: timeTaken
        });

        if (isCorrect) {
            quizData.correct = (quizData.correct || 0) + 1;
        } else {
            quizData.wrong = (quizData.wrong || 0) + 1;
        }

        quizData.highest_level_reached = Math.max(quizData.highest_level_reached || 1, newSkillLevel);
        quizData.total_quiz_time = timeTaken;

        await quizData.save();

        res.json({ message: isCorrect ? 'Correct!' : 'Wrong!', correctIndex: correctQuestionIndex, selected: answerNumber, skill_level: newSkillLevel });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    quizAttempt,
    getQuestion,
    answerQuestion
};