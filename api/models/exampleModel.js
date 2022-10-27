const mongoose = require('mongoose')

let exampleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    seedNumber: {
        type: String,
        required: 'Seed Number is required'
    },
    flags: {
        type: String,
        required: 'Flags are required'
    },
    hash: {
        type: String,
        required: 'Hash is required'
    },
    mediaUrl: {
        type: String
    },
    difficulty: {
        type: Number
    },
    ownerId: {
        type: String,
        required: 'Flags are required'
    },
})

module.exports = mongoose.model("examples", exampleSchema)