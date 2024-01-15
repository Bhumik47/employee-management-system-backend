const User = require("../models/user.js");
const jwt = require("jsonwebtoken");


exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Login first",
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.User.findOne({ _id: decoded._id }).select('-password');
    next();
}