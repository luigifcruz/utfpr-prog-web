require("./config/database").connect();

const express = require("express");
const app = express();

const Auth = require("./controller/auth")
const Post = require("./controller/post")

app.use(express.json({ limit: "50mb" }));
app.use("/signup", Auth.signup);
app.use("/signin", Auth.signin);
app.use("/post/new", Auth.verifyToken, Auth.isAdmin, Post.new);
app.use("/post/search", Auth.verifyToken, Post.search);
app.use("/", express.static("./static/public"));

module.exports = app;
