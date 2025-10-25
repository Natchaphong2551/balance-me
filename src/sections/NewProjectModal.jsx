import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";

export default function NewProjectModal({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function createProject(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await addDoc(collection(db, "projects"), {
      name: name.trim(),
      description: description.trim(),
      color: "purple",
      createdAt: serverTimestamp(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.form
        onSubmit={createProject}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
        className="w-full max-w-lg card-lg grid gap-3"
      >
        <h3 className="text-lg font-semibold">Create New Project</h3>
        <label className="text-sm muted">ชื่อโครงการ</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />

        <label className="text-sm muted">คำอธิบาย</label>
        <textarea className="textarea" rows={3} value={description} onChange={e=>setDescription(e.target.value)} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn btn-outline">ยกเลิก</button>
          <button className="btn btn-primary">บันทึก</button>
        </div>
      </motion.form>
    </div>
  );
}
