// src/pages/Summary.jsx
import React, { useEffect, useState } from "react";
import MultiProjectPicker from "../components/MultiProjectPicker.jsx";
import CombinedSummary from "../components/CombinedSummary.jsx";
import { db } from "../lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export default function Summary() {
  const [ids, setIds] = useState([]);
  const [rows, setRows] = useState([]);
  const [projectNames, setProjectNames] = useState({}); // { projectId: name }

  // ดึงชื่อโครงการตามที่เลือก (ครั้งละชุด เมื่อ ids เปลี่ยน)
  useEffect(() => {
    async function loadNames() {
      const map = {};
      for (const pid of ids) {
        const snap = await getDoc(doc(db, "projects", pid));
        if (snap.exists()) map[pid] = snap.data().name || pid;
      }
      setProjectNames(map);
    }
    if (ids.length) loadNames(); else setProjectNames({});
  }, [ids]);

  // ดึงรายการรายรับ/รายจ่ายของโครงการที่เลือก มารวมเป็นตารางเดียว
  useEffect(() => {
    async function fetchAll() {
      let list = [];
      for (const pid of ids) {
        const inc = await getDocs(collection(db, "projects", pid, "incomes"));
        inc.forEach(d => list.push({ type: "income", pid, id: d.id, ...d.data() }));
        const exp = await getDocs(collection(db, "projects", pid, "expenses"));
        exp.forEach(d => list.push({ type: "expense", pid, id: d.id, ...d.data() }));
      }
      list.sort((a,b) => (b.date?.toDate?.()??0) - (a.date?.toDate?.()??0));
      setRows(list);
    }
    if (ids.length) fetchAll(); else setRows([]);
  }, [ids]);

  return (
    <>
      <h1 className="text-xl font-bold mb-3">ดูสรุปบัญชี</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <MultiProjectPicker selectedIds={ids} onChange={setIds} />
        <CombinedSummary projectIds={ids} />
      </div>

      <div className="card overflow-x-auto mt-4">
        <table className="table-dark">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ประเภท</th>
              <th>โครงการ</th>{/* <-- ใช้ชื่อโครงการไทย */}
              <th>รายละเอียด</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.date?.toDate ? r.date.toDate().toLocaleString() : ""}</td>
                <td>{r.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
                <td>{projectNames[r.pid] || "กำลังโหลด…"}</td>{/* <-- แสดงชื่อแทน id */}
                <td>
                  {r.type === "income"
                    ? `${r.source ?? ""} • ผู้ให้: ${r.payerFrom ?? ""} → ผู้รับ: ${r.receiverTo ?? ""}`
                    : `${r.itemName ?? ""} • ${r.category ?? ""} • ผู้จ่าย: ${r.payer ?? ""}`}
                </td>
                <td>{Number(r.amount || 0).toLocaleString()} บาท</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="text-center muted py-6">เลือกโครงการทางซ้ายก่อน</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
