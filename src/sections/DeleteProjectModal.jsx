// src/sections/DeleteProjectModal.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { deleteProjectDeep } from "../lib/firestoreOps";
import { db } from "../lib/firebase";
import { motion } from "framer-motion";

export default function DeleteProjectModal({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "projects", projectId));
      setProject({ id: projectId, ...snap.data() });
    }
    if (projectId) load();
  }, [projectId]);

  async function onConfirm() {
    setDeleting(true);
    setError("");
    try {
      await deleteProjectDeep(projectId);
      onClose(true);
    } catch (e) {
      setError(e?.message || "ลบไม่สำเร็จ");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}
        className="w-full max-w-lg card-lg grid gap-3"
      >
        <h3 className="text-lg font-semibold">ลบโปรเจกต์</h3>
        <p className="text-sm">
          คุณกำลังจะลบโปรเจกต์ <b>{project?.name || projectId}</b>
        </p>
        <div className="text-sm muted">
          การลบนี้จะ<strong>ลบข้อมูลทั้งหมดภายใน</strong> ได้แก่ รายรับ/รายจ่าย และไฟล์ใบเสร็จ/หลักฐาน ที่อยู่ในโปรเจกต์นี้ด้วย ไม่สามารถกู้คืนได้
        </div>
        {error && <div className="text-sm bad">เกิดข้อผิดพลาด: {error}</div>}
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn btn-outline" onClick={()=>onClose(false)} disabled={deleting}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={deleting}>
            {deleting ? "กำลังลบ…" : "ยืนยันการลบ"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
