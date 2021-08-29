const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/dev";

exports.connect = () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Mongo stated successfully.");
        })
        .catch((err) => {
            console.log("Mongo failed.")
            console.error(err);
            process.exit(1);
        });
}
