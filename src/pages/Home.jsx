// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import NewProjectModal from "../sections/NewProjectModal.jsx";
import EditProjectModal from "../sections/EditProjectModal.jsx";
import DeleteProjectModal from "../sections/DeleteProjectModal.jsx";
import { motion } from "framer-motion";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [openNew, setOpenNew] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  // ปิดเมนูเมื่อคลิกนอก
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Project</h1>
        <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
          <button onClick={() => setOpenNew(true)} className="btn btn-primary">Create New Project</button>
          <Link to="/summary" className="btn btn-outline">ดูสรุปบัญชี</Link>
        </div>
      </div>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(p => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
            className="card relative"
          >
            {/* Header เล็ก */}
            <div className="flex items-start justify-between">
              <div className="muted text-xs">Balance me</div>
              {/* ปุ่มเคบับ */}
              <button
                className="pill leading-none"
                onClick={() => setMenuOpenId(prev => prev === p.id ? null : p.id)}
                aria-label="Project menu"
                title="Project menu"
              >
                {/* ไอคอน ⋮ */}
                <span style={{letterSpacing: "2px"}}>⋮</span>
              </button>
            </div>

            <h3 className="mt-1 font-semibold">{p.name}</h3>
            <p className="text-sm muted mt-1 line-clamp-2">{p.description || "Discription"}</p>

            <div className="mt-3 flex justify-end">
              <Link to={`/project/${p.id}`} className="btn btn-outline">เปิดโปรเจกต์</Link>
            </div>

            {/* เมนู dropdown */}
            {menuOpenId === p.id && (
              <div ref={menuRef} className="absolute right-3 top-10 z-20 w-44 card p-1">
                <button
                  onClick={() => { setEditId(p.id); setMenuOpenId(null); }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5"
                >
                  แก้ไขชื่อ/คำอธิบาย
                </button>
                <button
                  onClick={() => { setDeleteId(p.id); setMenuOpenId(null); }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5"
                >
                  ลบโปรเจกต์
                </button>
              </div>
            )}
          </motion.div>
        ))}
        {projects.length === 0 && (
          <div className="card text-center muted">ยังไม่มีโปรเจกต์ — กด Create New Project</div>
        )}
      </div>

      {openNew && <NewProjectModal onClose={() => setOpenNew(false)} />}
      {editId && <EditProjectModal projectId={editId} onClose={() => setEditId(null)} />}
      {deleteId && <DeleteProjectModal projectId={deleteId} onClose={() => setDeleteId(null)} />}
    </>
  );
}
