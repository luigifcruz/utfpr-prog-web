const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    adm: { type: Boolean, default: false },
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
