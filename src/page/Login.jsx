import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        if (user.username === "admin" && user.password === "3006") {
            setError("");
            localStorage.setItem("login", "true");
            navigate("/employee");
        } else {
            setError("invalid username or password");
        }
    };
    return (
        <div className="container mt-5">
            <div className="card p-4 shadow col-md-4 mx-auto">

                <h2 className="text-center">Login</h2>
                <input type="text" name="username" placeholder="username" onChange={handleChange} className="form-control mt-2" />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="form-control mt-2" />
                <small className="text-danger">{error}</small>
                <button onClick={handleLogin} className="btn btn-primary mt-3">Login </button>
            </div>
        </div>

    )
};
export default Login;