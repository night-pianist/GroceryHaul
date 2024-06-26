import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Map from './components/Map'
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';


function App() {
  return (
      <>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/" element={<Map/>} />
        </Routes>
      </>
  )
}

export default App
