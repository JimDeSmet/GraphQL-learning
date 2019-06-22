const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String,
    postId: String,
    userId: String
})

module.exports = mongoose.model('Comment', commentSchema);