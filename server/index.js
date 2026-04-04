const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const Employee = require("./models/Employee");




mongoose.connect("mongodb://127.0.0.1:27017/employeedb")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


app.get("/employees", async (req, res) => {
    try {
        const data = await Employee.find();
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.post("/employees", async (req, res) => {
    try {
        const newEmp = new Employee(req.body);
        const saved = await newEmp.save();
        res.json(saved);
    } catch (err) {
        res.status(500).send(err);
    }
});



app.put("/employees/:id", async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).send(err);
    }
});



app.delete("/employees/:id", async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).send(err);
    }
});



app.delete("/employees", async (req, res) => {
    try {
        await Employee.deleteMany();
        res.json({ message: "All Deleted" });
    } catch (err) {
        res.status(500).send(err);
    }
});



app.listen(5000, () => {
    console.log("Server running on port 5000");
});