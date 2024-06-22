import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './components/Home'
import Map from './components/Map'

function App() {
  return (
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home/>} /> */}
          <Route path="/" element={<Map/>} />
        </Routes>
      </Router>
  )
}

export default App
