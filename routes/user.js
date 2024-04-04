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
const router = express.Router();

router.get("/all", getAllUsers);

router.post("/new", register);
router.post("/login", login);

router.get("/me", getMyProfile);
router.get("/logout", logout);

//manager crud
router.post("/create", createUser);
router.put("/update", updateUser);
router.delete("/delete/:id", deleteUser);

//filter employees
router.post("/filter", getNonManagers);

module.exports = router;
