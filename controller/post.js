const Post = require("../model/post");

exports.new = async (req, res) => {
    const { title, abstract } = req.body;

    if (title.length < 3 || abstract.length < 3) {
        return res.status(400).send("Invalid field.");
    }

    let post = await Post.create({
        title,
        abstract,
    });

    return res.status(201).json(post);
};

exports.search = async (req, res) => {
    const term = req.body.term || req.query.term;

    const results = await Post.find({
        $or: [
            { title: new RegExp(term, 'i') },
            { abstract: new RegExp(term, 'i') },
        ]
    });

    return res.status(201).send(results);
};
