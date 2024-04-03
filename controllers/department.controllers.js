const { ErrorHandler } = require("../middlewares/error");
const Department = require("../models/department");

// Create a department
exports.createDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(name);
    if (!name) return next(new ErrorHandler("Name is Required", 400));
    const department = new Department({ name });
    const savedDepartment = await department.save();

    res.status(201).json({
      success: true,
      data: savedDepartment,
      message: "Department created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "employees",
      select: "-password", // Exclude the password field
      populate: {
        path: "department",
        select: "_id name",
      },
    });

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { name, _id } = req.body;
    const updatedDepartment = await Department.findByIdAndUpdate(
      _id,
      { name },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDepartment,
      message: "Department updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);

    if (!deletedDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
