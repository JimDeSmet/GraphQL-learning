const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogpostSchema = new Schema({
    title: String,
    content: String,
    userId: String
})

module.exports = mongoose.model('Blogpost', blogpostSchema);