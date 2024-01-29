const { User } = require("../models/user.js");
const bcrypt = require("bcrypt");
const { sendCookie } = require("../utilities/features.js");
const { ErrorHandler } = require("../middlewares/error.js");
const Department = require("../models/department.js");


exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users where ismanager is false, and populate the 'department' field to get the department name
        const users = await User.find({ ismanager: false }).populate('department', 'name');

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return next(new ErrorHandler("User Already Exist", 400));

        const hashedPassword = await bcrypt.hash(password, 10);


        user = await User.create({ name, email, password: hashedPassword, ismanager: true });
        const formatedUser = { name: user.name, email: user.email, ismanager: user.ismanager, date: user.createdAt, _id: user._id }

        sendCookie(formatedUser, res, "Registered Successfully", 201);
    } catch (error) {
        next(error)
    }
}


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(new ErrorHandler("Invalid Email or Password", 400));
        const formatedUser = { name: user.name, email: user.email, ismanager: user.ismanager, date: user.createdAt, _id: user._id }
        sendCookie(formatedUser, res, `Welcome back, ${user.name}`, 200)

    } catch (error) {
        next(error)
    }
}

exports.getMyProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.logout = (req, res) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        samesite: process.env.NODE_ENV === "development" ? "lax " : "none",
        secure: process.env.NODE_ENV === "development" ? false : true,
    }).json({
        success: true,
        user: req.user
    })
}

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, salary, deparcd backtment, address } = req.body;
        console.log(req.body)
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            salary,
            department,
            address,
        });

        const savedUser = await user.save();

        res.status(201).json({
            success: true,
            data: savedUser,
            message:"Employee Added Successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { name, email, salary, department, address, _id } = req.body;

        // Find the user before the update
        const userBeforeUpdate = await User.findById(_id);
        // Check if the department ID has changed
        if (userBeforeUpdate.department.toString() !== department) {
            // Remove the user from the previous department's employees array
            await Department.findByIdAndUpdate(
                userBeforeUpdate.department,
                { $pull: { employees: userBeforeUpdate._id } }
            );

            // Add the user to the new department's employees array
            await Department.findByIdAndUpdate(
                department,
                { $addToSet: { employees: userBeforeUpdate._id } }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { name, email, salary, department, address },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(201).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: deletedUser,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

//filter employees

exports.getNonManagers = async (req, res) => {
    try {
        const { sortBy, sortOrder } = req.body;

        const sortOptions = {};
        if (sortBy && ['name', 'address'].includes(sortBy)) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        const nonManagers = await User.find({ ismanager: false })
            .sort(sortOptions)
            .collation({ locale: 'en' }) // Set collation to 'en' for case-insensitive sorting
            .populate('department'); // If you want to populate the department information

        res.status(200).json({
            success: true,
            data: nonManagers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};