require("./config/database").connect();

const express = require("express");
const app = express();

const Auth = require("./controller/auth")

app.use(express.json({ limit: "50mb" }));
app.use("/signup", Auth.signup);
app.use("/signin", Auth.signin);
app.use("/", express.static("./static/public"));

module.exports = app;
