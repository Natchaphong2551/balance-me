import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Summary from "./pages/Summary.jsx";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="min-h-screen">
      <header
        className="sticky top-0 z-10 border-b"
        style={{ background: "rgba(17,17,26,0.6)", backdropFilter: "blur(8px)", borderColor: "var(--border)" }}
      >
        <div className="container-page py-3 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight">Balance me</Link>
          <nav className="text-sm flex gap-2 md:gap-3">
            <Link to="/" className="pill hover:bg-white/5">Project</Link>
            <Link to="/summary" className="pill hover:bg-white/5">ดูสรุปบัญชี</Link>
          </nav>
        </div>
      </header>

      <motion.main
        className="container-page py-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </motion.main>

      <footer className="py-8 text-center text-xs muted">© Balance Me</footer>
    </div>
  );
}
