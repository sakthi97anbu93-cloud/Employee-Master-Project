const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    code: String,
    name: String,
    department: String,
    designation: String,
    dob: String,
    doj: String,
    gender: String,
    salary: String,
});

module.exports = mongoose.model("Employee", employeeSchema);