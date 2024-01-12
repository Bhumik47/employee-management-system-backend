const mongoose = require("mongoose");
const Department = require("./department")

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        select: false,
        required: true,
    },
    salary: {
        type: Number,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    address: {
        type: String
    },
    ismanager: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

exports.User = mongoose.model("User", Schema);
