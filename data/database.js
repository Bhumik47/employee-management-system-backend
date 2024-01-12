const mongoose = require("mongoose");

exports.connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, { dbName: "employee" })
        .then((c) => {
            console.log(`mongoDB connected with ${c.connection.host}`);
        })
        .catch((e) => console.log(e));
}