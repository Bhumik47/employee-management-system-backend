const { ErrorHandler } = require("../middlewares/error");
const Department = require("../models/department");

// Create a department
exports.createDepartment = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) return next(new ErrorHandler("Name is Required", 400));
        const department = new Department({ name, description });
        const savedDepartment = await department.save();

        res.status(201).json({
            success: true,
            data: savedDepartment,
            message: "Department created successfully"
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
        const departments = await Department.find();

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
}

exports.updateDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedDepartment = await Department.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!updatedDepartment) {
            return res.status(404).json({
                success: false,
                message: 'Department not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedDepartment,
            message: "Department updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

exports.deleteDepartment = async (req, res) => {
    try {
        const deletedDepartment = await Department.findByIdAndDelete(req.params.id);

        if (!deletedDepartment) {
            return res.status(404).json({
                success: false,
                message: 'Department not found',
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

