const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define a pre middleware to delete associated employees when department is deleted
departmentSchema.pre("findOneAndDelete", async function (next) {
  try {
    // Access the department being deleted using `this` keyword
    const deletedDepartment = await this.model.findOne(this.getFilter());

    if (deletedDepartment) {
      // Delete all employees associated with the department
      await mongoose
        .model("User")
        .deleteMany({ _id: { $in: deletedDepartment.employees } });
    }

    // Continue with the original findOneAndDelete operation
    next();
  } catch (error) {
    // Handle error if needed
    next(error);
  }
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
