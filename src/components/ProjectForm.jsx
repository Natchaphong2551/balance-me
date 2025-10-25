import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export function ProjectForm({ onCreated }) {
  const [name, setName] = useState("");

  async function createProject(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const docRef = await addDoc(collection(db, "projects"), {
      name: name.trim(),
      color: "purple",
      createdAt: serverTimestamp(),
      totals: { income: 0, expense: 0, balance: 0 },
    });
    setName("");
    onCreated && onCreated({ id: docRef.id, name });
  }

  return (
    <form onSubmit={createProject} className="bg-white rounded-2xl shadow p-4 grid gap-3">
      <h2 className="font-semibold">สร้างโครงการใหม่</h2>
      <label className="text-sm">ชื่อโครงการ</label>
      <input
        className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="เช่น แสตนเชียร์, ขบวน"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="bg-purple-600 text-white rounded-xl px-3 py-2 hover:bg-purple-700">บันทึกโครงการ</button>
    </form>
  );
}
