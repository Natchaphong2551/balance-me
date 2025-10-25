import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function CombinedSummary({ projectIds = [] }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    async function sumAll() {
      let inc = 0, exp = 0;
      for (const pid of projectIds) {
        const incSnap = await getDocs(collection(db, "projects", pid, "incomes"));
        incSnap.forEach(d => inc += Number(d.data().amount || 0));
        const expSnap = await getDocs(collection(db, "projects", pid, "expenses"));
        expSnap.forEach(d => exp += Number(d.data().amount || 0));
      }
      setIncome(inc); setExpense(exp);
    }
    if (projectIds.length) sumAll(); else { setIncome(0); setExpense(0); }
  }, [projectIds]);

  const balance = useMemo(() => income - expense, [income, expense]);

  return (
    <div className="card-lg">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="muted text-xs">รวมรายรับ (หลายโครงการ)</div>
          <div className="text-2xl font-bold">{income.toLocaleString()} บาท</div>
        </div>
        <div>
          <div className="muted text-xs">รวมรายจ่าย (หลายโครงการ)</div>
          <div className="text-2xl font-bold">{expense.toLocaleString()} บาท</div>
        </div>
        <div>
          <div className="muted text-xs">คงเหลือรวม</div>
          <div className={`text-2xl font-bold ${ (income-expense)<0 ? "bad":"good"}`}>
            {balance.toLocaleString()} บาท
          </div>
        </div>
      </div>
    </div>
  );
}
