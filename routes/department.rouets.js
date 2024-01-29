const express = require("express");
const { createDepartment, getDepartments, updateDepartment, deleteDepartment } = require("../controllers/department.controllers");

const router = express.Router();

router.post("/create", createDepartment);
router.get("/get", getDepartments);
router.put("/update", updateDepartment);
router.delete("/delete/:id", deleteDepartment);

module.exports = router;