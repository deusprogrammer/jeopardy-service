const mongoose = require('mongoose')

let categorySchema = new mongoose.Schema({
    categoryString: {
        type: String,
        required: 'Category String is required'
    }
});

module.exports = mongoose.model("categories", categorySchema);