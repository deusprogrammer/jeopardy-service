const mongoose = require('mongoose')

let cardSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: 'Answer is required'
    },
    question: {
        type: String,
        required: 'Question is required'
    },
    category: {
        type: String,
        required: "Category is required"
    },
    difficulty: {
        type: Number,
        required: "Difficulty is required"
    },
    mediaUrl: {
        type: String
    },
    type: {
        type: String
    }
})

module.exports = mongoose.model("cards", cardSchema);