require("./config/database").connect();

const express = require("express");
const jwt = require("jsonwebtoken");

const user = require("./model/user");
//const auth = require("./controler/auth");

const app = express();

app.use(express.json({ limit: "50mb" }));

app.post("/signup", async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;

        if (email.length < 3 || password.length < 3) {
            res.status(400).send("Invalid field.");
        }

        const newUser = await user.create({
            email: email.toLowerCase(),
            password,
        });

        const token = jwt.sign({
            user_id: newUser._id,
            email,
        }, "iamthetokenkey");

        newUser.token = token;
        res.status(201).json(newUser);
    } catch(err) {
        res.status(503).send("Internal server error.");
        console.warn(err);
    }
});

module.exports = app;
