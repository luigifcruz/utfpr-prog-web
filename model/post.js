const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String },
    abstract: { type: String },
});

module.exports = mongoose.model("post", postSchema);
