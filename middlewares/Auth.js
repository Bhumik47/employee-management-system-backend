const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Login required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.User.findOne({ _id: decoded._id })
      .populate({
        path: "department",
        select: "_id name",
      })
      .select("-password");
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};
