// src/sections/EditProjectModal.jsx
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";

export default function EditProjectModal({ projectId, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "projects", projectId));
      const data = snap.data() || {};
      setName(data.name || "");
      setDescription(data.description || "");
    }
    if (projectId) load();
  }, [projectId]);

  async function onSave(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await updateDoc(doc(db, "projects", projectId), {
      name: name.trim(),
      description: description.trim(),
    });
    setSaving(false);
    onClose(true);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.form
        onSubmit={onSave}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
        className="w-full max-w-lg card-lg grid gap-3"
      >
        <h3 className="text-lg font-semibold">แก้ไขโปรเจกต์</h3>

        <label className="text-sm muted">ชื่อโครงการ</label>
        <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />

        <label className="text-sm muted">คำอธิบาย</label>
        <textarea className="textarea" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={()=>onClose(false)} className="btn btn-outline">ยกเลิก</button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "กำลังบันทึก…" : "บันทึก"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
