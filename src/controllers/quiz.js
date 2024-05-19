const generateQuestion = require('../../helpers/generateQuestionAI');

const correctQuestionIndexesMap = new WeakMap();

const quizAttempt = async (req, res) => {
    const { question, options, correctIndex } = await generateQuestion(1)
	correctQuestionIndexesMap.delete(req.user);
	correctQuestionIndexesMap.set(req.user, correctIndex);
    const plainQuestion = { question, "options": [...options], skill_level: 1 }
    res.json(plainQuestion)
}

const getQuestion = async (req, res) => {
    const { updatedSkillLevel } = req.body
    const { question, options, correctIndex } = await generateQuestion(updatedSkillLevel)
    correctQuestionIndex = correctIndex;
	correctQuestionIndexesMap.delete(req.user);
	correctQuestionIndexesMap.set(req.user, correctIndex);

    const plainQuestion = { "question": question, "options": [...options], updatedSkillLevel }
    res.json(plainQuestion)
}

const answerQuestion = async (req, res) => {
    //Recives answer from the user
    const { answerNumber, updatedSkillLevel } = req.body;

	const correctQuestionIndex = correctQuestionIndexesMap.get(req.user);
    //Check if correct or wrong
    if (answerNumber == correctQuestionIndex) {
		// if aswer is corect we delete from memory the index of correct aswer
		correctQuestionIndexesMap.delete(req.user);
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