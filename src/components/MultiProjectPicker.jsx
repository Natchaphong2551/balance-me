import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function MultiProjectPicker({ selectedIds = [], onChange }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  function toggle(id) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id];
    onChange(next);
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">เลือกหลายโครงการเพื่อสรุปรวม</h3>
      <ul className="grid gap-2">
        {projects.map(p => (
          <li key={p.id} className="flex items-center gap-2">
            <input
              id={`pick-${p.id}`}
              type="checkbox"
              checked={selectedIds.includes(p.id)}
              onChange={() => toggle(p.id)}
            />
            <label htmlFor={`pick-${p.id}`} className="cursor-pointer">
              {p.name} <span className="text-xs muted">({p.color})</span>
            </label>
          </li>
        ))}
        {projects.length === 0 && <li className="muted text-sm">ยังไม่มีโปรเจกต์</li>}
      </ul>
    </div>
  );
}
