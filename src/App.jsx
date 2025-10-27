import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Summary from "./pages/Summary.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { motion } from "framer-motion";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-purple-800 z-10">
        <div className="container-page py-3 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
            Balance Me
          </Link>
          <nav className="text-sm flex items-center gap-3">
            {user ? (
              <>
                <Link to="/" className="hover:text-purple-400">โครงการ</Link>
                <Link to="/summary" className="hover:text-purple-400">สรุปบัญชี</Link>
                <button onClick={logout} className="hover:text-fuchsia-400">ออกจากระบบ</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-400">เข้าสู่ระบบ</Link>
                <Link to="/register" className="hover:text-fuchsia-400">สมัครสมาชิก</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <motion.main
        className="container-page py-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        </Routes>
      </motion.main>

      <footer className="text-center text-xs py-6 text-gray-500">© Balance Me</footer>
    </div>
  );
}
