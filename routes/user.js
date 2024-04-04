const express = require("express");
const {
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  createUser,
  updateUser,
  deleteUser,
  getNonManagers,
} = require("../controllers/user.js");
const { isAuthenticated } = require("../middlewares/Auth.js");

const router = express.Router();

router.get("/all", isAuthenticated, getAllUsers);

router.post("/new", register);
router.post("/login", login);

router.get("/me", isAuthenticated, getMyProfile);
router.get("/logout", logout);

//manager crud
router.post("/create", isAuthenticated, createUser);
router.put("/update", isAuthenticated, updateUser);
router.delete("/delete/:id", isAuthenticated, deleteUser);

//filter employees
router.post("/filter", isAuthenticated, getNonManagers);

module.exports = router;
