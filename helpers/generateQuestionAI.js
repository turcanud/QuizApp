const OpenAI = require('openai');

require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY });

async function generateQuestion(level) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        response_format: { "type": "json_object" },
        messages: [{
            role: "system", content: `You are a quiz master.
        You will ask a math question with 4 multiple choice answers.
        There will be 10 levels representing the hardness of the question.
        Now you have to send a question on the level ${level}/10 in the following json format (for example): {
            "question": "What is 12 ÷ 3?",
            "options": ["2", "3", "4", "6"],
            "correctIndex": 2
        }correctIndex will represent options[correctIndex] is the correct answer.It has to be a different question every time and they can not repeat.(do send only and only json and translate them in romanian)`}]
    });
    const aiResponse = completion.choices[0].message.content
    const json = JSON.parse(aiResponse)
    return json;
}

module.exports = generateQuestion;