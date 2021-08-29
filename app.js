require("./config/database").connect();

const express = require("express");

const Auth = require("./controller/auth")
const User = require("./model/user");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use("/signup", Auth.signup);
app.use("/signin", Auth.signin);

app.get("/welcome", Auth.verifyToken, (req, res) => {
    res.status(200).send("Hello");
});

module.exports = app;
