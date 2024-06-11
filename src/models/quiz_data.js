const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuestionDataSchema = new Schema({
    question_id: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    state_answer: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    time: {
        type: String
    }
}, { timestamps: true });

const dataSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    total_quiz_time: {
        type: String,
    },
    skipped: {
        type: Number,
    },
    correct: {
        type: Number,
    },
    wrong: {
        type: Number,
    },
    highest_level_reached: {
        type: Number,
    },
    questions_data: [QuestionDataSchema]
}, { timestamps: true });

const QuizData = mongoose.model('QuizData', dataSchema);
module.exports = QuizData;