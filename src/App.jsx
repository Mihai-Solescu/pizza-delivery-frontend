import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import NormalOrder from './pages/NormalOrder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<NormalOrder />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
