import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

export function ProjectList({ activeProject, onSelect }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProjects(list);
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold mb-2">โครงการทั้งหมด</h2>
      <ul className="grid gap-2">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onSelect(p)}
              className={`w-full text-left px-3 py-2 rounded-xl border ${activeProject?.id === p.id ? "border-purple-500 bg-purple-50" : "border-purple-100 hover:bg-purple-50"}`}
            >
              <div className="font-medium">{p.name}</div>
              <div className="text-xs opacity-70">สี: {p.color}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
