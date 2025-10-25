import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { RecordForm } from "../components/RecordForm.jsx";
import { RecordsTable } from "../components/RecordsTable.jsx";
import { SummaryBar } from "../components/SummaryBar.jsx";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tab, setTab] = useState("incomes");
  const [records, setRecords] = useState([]);

  useEffect(() => { getDoc(doc(db, "projects", id)).then(s => setProject({ id, ...s.data() })); }, [id]);
  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, "projects", id, tab), orderBy("date", "desc"));
    const unsub = onSnapshot(q, snap => setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [id, tab]);

  if (!project) return <div className="muted text-sm">กำลังโหลด…</div>;

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row md:items-end gap-2">
        <div>
          <div className="muted text-xs">Balance me • Project</div>
          <h1 className="text-xl font-bold">{project.name}</h1>
          <p className="text-sm muted">{project.description}</p>
        </div>
        <div className="md:ml-auto"><Link to="/" className="btn btn-outline">← กลับหน้าแรก</Link></div>
      </div>

      <div className="card mb-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>setTab("incomes")}  className={`btn-tab ${tab==="incomes"?"btn-tab-active":""}`}>บันทึกรายรับ</button>
          <button onClick={()=>setTab("expenses")} className={`btn-tab ${tab==="expenses"?"btn-tab-active":""}`}>บันทึกรายจ่าย</button>
          <button onClick={()=>setTab("summary")}  className={`btn-tab ${tab==="summary"?"btn-tab-active":""}`}>สรุปบัญชี</button>
        </div>
      </div>

      {tab === "summary" ? (
        <SummaryBar projectId={project.id} />
      ) : (
        <>
          <RecordForm projectId={project.id} kind={tab} />
          <RecordsTable kind={tab} records={records} />
        </>
      )}
    </>
  );
}
