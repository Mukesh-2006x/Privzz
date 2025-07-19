import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import About from '../pages/About';
import Video from '../pages/Video';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔐 Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/video" element={<Video />} />
        </Route>
      </Route>

      {/* 🔓 Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
