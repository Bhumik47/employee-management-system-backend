const express = require("express");
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department.controllers");
const { isAuthenticated } = require("../middlewares/Auth");

const router = express.Router();

router.post("/create", isAuthenticated, createDepartment);
router.get("/get", isAuthenticated, getDepartments);
router.put("/update", isAuthenticated, updateDepartment);
router.delete("/delete/:id", isAuthenticated, deleteDepartment);

module.exports = router;
