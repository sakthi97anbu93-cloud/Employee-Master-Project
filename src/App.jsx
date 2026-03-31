import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./page/Login";
import EmployeeForm from './components/EmployeeForm';
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/employee" element={<EmployeeForm />} />

    </Routes>
    </BrowserRouter>
  );
};

export default App;
   