

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeForm() {
    const [form, setForm] = useState({
        code: "",
        name: "",
        department: "",
        designation: "",
        dob: "",
        doj: "",
        gender: "",
        salary: "",
    });

    const [list, setList] = useState([]);
    const [error, setError] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [touched, setTouched] = useState({});

    const navigate = useNavigate();

    const departments = ["HR", "Admin", "IT", "Finance", "Marketing", "Support"];
    const designations = ["Manager", "Team Lead", "Developer", "Accountant", "Tester"];

    useEffect(() => {
        axios.get("http://localhost:5000/employees")
            .then(res => setList(res.data))
            .catch(err => console.log(err));
    }, []);


    useEffect(() => {
        const isLogin = localStorage.getItem("login");
        if (!isLogin) {
            navigate("/");
        }
    },
        [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });

        validateField(name, value);
    };
    const validateField = (name, value) => {
        let err = { ...error };

        if (name === "code") {
            if (!value.match(/^[0-9]*$/)) {
                err.code = "Code must be numeric";
            } else {
                delete err.code;
            }
        }

        if (name === "name") {
            if (!value.match(/^[A-Za-z ]*$/)) {
                err.name = "Only alphabets allowed";
            } else {
                delete err.name;
            }
        }

        if (name === "department") {
            value ? delete err.department : err.department = "Select department";
        }

        if (name === "designation") {
            value ? delete err.designation : err.designation = "Select designation";
        }

        if (name === "dob") {
            const today = new Date();
            const dob = new Date(value);
            let age = today.getFullYear() - dob.getFullYear();

            if (age < 18) {
                err.dob = "Age must be at least 18";
            } else {
                delete err.dob;
            }
        }

        if (name === "doj") {
            const today = new Date().toISOString().split("T")[0];
            if (value < today) {
                err.doj = "DOJ cannot be past date";
            } else {
                delete err.doj;
            }
        }

        if (name === "gender") {
            value ? delete err.gender : err.gender = "Select gender";
        }

        if (name === "salary") {
            if (!value.match(/^\d{0,7}(\.\d{0,2})?$/)) {
                err.salary = "Max 7 digits with decimal";
            } else {
                delete err.salary;
            }
        }

        setError(err);
    };
    const handleBlur = (e) => {
        const { name } = e.target;

        setTouched({ ...touched, [name]: true });

        validateField(name, form[name]);
    };

    const validate = () => {
        let err = {};

        if (!form.code.match(/^[0-9]+$/)) err.code = "Code must be numeric";


        if (list.find(item => item.code === form.code && item._id !== list[editIndex]?._id))
            err.code = "Duplicate code not allowed";

        if (!form.name.match(/^[A-Za-z ]+$/)) err.name = "Only alphabets allowed";

        if (!form.department) err.department = "Select department";

        if (!form.designation) err.designation = "Select designation";

        const today = new Date();
        const dob = new Date(form.dob);
        let age = today.getFullYear() - dob.getFullYear();
        if (age < 18) err.dob = "Age must be at least 18";

        const day = new Date().toISOString().split("T")[0];
        if (form.doj < day) err.doj = "DOJ cannot be past date";

        if (!form.gender) err.gender = "Select gender";

        if (!form.salary.match(/^\d{1,7}(\.\d{1,2})?$/))
            err.salary = "Max 7 digits with decimal";

        return err;
    };


    const handleAdd = () => {
        const err = validate();
        if (Object.keys(err).length > 0) {
            setError(err);
            return;
        }

        if (editIndex !== null) {
            const id = list[editIndex]._id;

            axios.put(`http://localhost:5000/employees/${id}`, form)
                .then(res => {
                    const updated = [...list];
                    updated[editIndex] = res.data;
                    setList(updated);
                    setEditIndex(null);
                });

        } else {
            axios.post("http://localhost:5000/employees", form)
                .then(res => setList([...list, res.data]));
        }

        setForm({
            code: "",
            name: "",
            department: "",
            designation: "",
            dob: "",
            doj: "",
            gender: "",
            salary: "",
        });

        setError({});
    };

    const handleEdit = (index) => {
        setForm(list[index]);
        setEditIndex(index);
    };


    const handleDelete = (index) => {
        const id = list[index]._id;

        axios.delete(`http://localhost:5000/employees/${id}`)
            .then(() => setList(list.filter(item => item._id !== id)));
    };


    const handleDeleteAll = () => {
        axios.delete("http://localhost:5000/employees")
            .then(() => setList([]));
    };

    const handleLogout = () => {
        localStorage.removeItem("login");
        navigate("/");
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center text-bg-secondary text-white p-3 rounded">
                Employee Master
            </h3>

            <div className="card p-3 shadow">
                <div className="row">

                    <div className="col-md-4">
                        <label>Code</label>
                        <input name="code" value={form.code} onChange={handleChange} onBlur={handleBlur} className="form-control" />
                        <small className="text-danger">{touched.code && error.code}</small>
                    </div>

                    <div className="col-md-4">
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} className="form-control" />
                        <small className="text-danger">{touched.name && error.name}</small>
                    </div>

                    <div className="col-md-4">
                        <label>Department</label>
                        <select name="department" value={form.department} onChange={handleChange} onBlur={handleBlur} className="form-control">
                            <option value="">Select</option>
                            {departments.map((d, i) => <option key={i}>{d}</option>)}
                        </select>
                        <small className="text-danger">{touched.department && error.department}</small>
                    </div>

                    <div className="col-md-4 mt-2">
                        <label>Designation</label>
                        <select name="designation" value={form.designation} onChange={handleChange} onBlur={handleBlur} className="form-control">
                            <option value="">Select</option>
                            {designations.map((d, i) => <option key={i}>{d}</option>)}
                        </select>
                        <small className="text-danger">{touched.designation && error.designation}</small>
                    </div>

                    <div className="col-md-4 mt-2">
                        <label>DOB</label>
                        <input type="date" name="dob" value={form.dob} onChange={handleChange} onBlur={handleBlur} className="form-control" />
                        <small className="text-danger">{touched.dob && error.dob}</small>
                    </div>

                    <div className="col-md-4 mt-2">
                        <label>DOJ</label>
                        <input type="date" name="doj" value={form.doj} onChange={handleChange} onBlur={handleBlur} className="form-control" />
                        <small className="text-danger">{touched.doj && error.doj}</small>
                    </div>

                    <div className="col-md-4 mt-2">
                        <label>Gender</label>
                        <select name="gender" value={form.gender} onChange={handleChange} onBlur={handleBlur} className="form-control">
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                        <small className="text-danger">{error.gender}</small>
                    </div>

                    <div className="col-md-4 mt-2">
                        <label>Salary</label>
                        <input name="salary" value={form.salary} onChange={handleChange} onBlur={handleBlur} className="form-control" />
                        <small className="text-danger">{touched.salary && error.salary}</small>
                    </div>

                    <div className="col-md-4 mt-2 d-flex gap-2 align-items-end">
                        <button onClick={handleAdd} className="btn btn-primary w-50">
                            {editIndex !== null ? "Update" : "Add"}
                        </button>
                        <button className="btn btn-danger w-50" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    <div className="col-md-12 mt-2">
                        <button className="btn btn-warning w-25" onClick={handleDeleteAll}>
                            Delete All Employees
                        </button>
                    </div>

                </div>
            </div>

            {/* TABLE */}
            <table className="table table-bordered mt-4 text-center">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>DOB</th>
                        <th>DOJ</th>
                        <th>Gender</th>
                        <th>Salary</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map((item, i) => (
                        <tr key={item._id}>
                            <td>{i + 1}</td>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.department}</td>
                            <td>{item.designation}</td>
                            <td>{item.dob}</td>
                            <td>{item.doj}</td>
                            <td>{item.gender}</td>
                            <td>{item.salary}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(i)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeForm;    