const jwt = require("jsonwebtoken");

exports.sendCookie = (user, res, message, statusCode = 200) => {

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        samesite: process.env.NODE_ENV === "development" ? "lax " : "none",
        secure: process.env.NODE_ENV === "development" ? false : true,
    }).json({
        success: true,
        message,
    });
}