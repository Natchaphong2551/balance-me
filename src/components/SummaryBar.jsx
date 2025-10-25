import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function SummaryBar({ projectId }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    if (!projectId) return;
    const unsub1 = onSnapshot(collection(db, "projects", projectId, "incomes"), (snap)=>{
      let sum = 0; snap.forEach(d => sum += Number(d.data().amount||0)); setIncome(sum);
    });
    const unsub2 = onSnapshot(collection(db, "projects", projectId, "expenses"), (snap)=>{
      let sum = 0; snap.forEach(d => sum += Number(d.data().amount||0)); setExpense(sum);
    });
    return () => {unsub1(); unsub2();};
  }, [projectId]);

  const balance = useMemo(()=> income - expense, [income, expense]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card-lg">
        <div className="muted text-xs">รวมรายรับ</div>
        <div className="text-2xl font-bold">{income.toLocaleString()} บาท</div>
      </div>
      <div className="card-lg">
        <div className="muted text-xs">รวมรายจ่าย</div>
        <div className="text-2xl font-bold">{expense.toLocaleString()} บาท</div>
      </div>
      <div className="card-lg">
        <div className="muted text-xs">คงเหลือ</div>
        <div className={`text-2xl font-bold ${ (income-expense)<0 ? "bad":"good"}`}>
          {balance.toLocaleString()} บาท
        </div>
      </div>
    </div>
  );
}
