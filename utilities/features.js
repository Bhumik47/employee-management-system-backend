const jwt = require("jsonwebtoken");

exports.sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  const maxAge = 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
      samesite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message,
      user,
    });
};
