const jwt = require("jsonwebtoken");

exports.sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  const maxAge = 24 * 60 * 60 * 1000;

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge,
    })
    .json({
      success: true,
      message,
      user,
    });
};
