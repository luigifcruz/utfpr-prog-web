const jwt = require("jsonwebtoken");

const User = require("../model/user");

validateCredentials = (email, password) => {
    if (email.length < 3 || password.length < 3) {
        return true;
    }
    return false;
};

fillToken = async (email, user) => {
    user.token = jwt.sign({
        user_id: user._id,
        email,
    }, "iamthetokenkey");
};

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (validateCredentials(email, password)) {
            return res.status(400).send("Invalid field.");
        }

        if (await User.findOne({ email })) {
            return res.status(400).send("Email already exists.");
        }

        let user = await User.create({
            email: email.toLowerCase(),
            password,
        });
        fillToken(email, user);
        return res.status(201).json(user);
    } catch(err) {
        console.warn(err);
        return res.status(503).send("Internal server error.");
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (validateCredentials(email, password)) {
            return res.status(400).send("Invalid field.");
        }

        const user = await User.findOne({ email });
        if (user && (password === user.password)) {
            fillToken(email, user);
            return res.status(201).json(user);
        }
        return res.status(400).send("Invalid credentials.");
    } catch(err) {
        console.warn(err);
        return res.status(503).send("Internal server error.");
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("No token found.");
    }

    try {
        req.user = jwt.verify(token, "iamthetokenkey");
    } catch(err) {
        console.warn(err);
        return res.status(401).send("Token invalid.");
    }
    return next();
};
