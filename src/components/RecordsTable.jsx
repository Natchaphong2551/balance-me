import React, { useMemo } from "react";
import { format } from "date-fns";

function downloadCSV(filename, rows, headers) {
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function RecordsTable({ kind, records }) {
  const headers = useMemo(() => kind === "incomes"
    ? ["date","source","amount","payerFrom","receiverTo","receiptUrl","note"]
    : ["date","itemName","category","amount","payer","ref","billUrl","note"]
  ,[kind]);

  function toRows() {
    if (kind === "incomes") {
      return records.map(r => ({
        date: r.date?.toDate ? format(r.date.toDate(), "dd/MM/yyyy HH:mm") : "",
        source: r.source ?? "",
        amount: r.amount ?? 0,
        payerFrom: r.payerFrom ?? "",
        receiverTo: r.receiverTo ?? "",
        receiptUrl: r.receiptUrl ?? "",
        note: r.note ?? ""
      }));
    }
    return records.map(r => ({
      date: r.date?.toDate ? format(r.date.toDate(), "dd/MM/yyyy HH:mm") : "",
      itemName: r.itemName ?? "",
      category: r.category ?? "",
      amount: r.amount ?? 0,
      payer: r.payer ?? "",
      ref: [r.vendor, r.invoiceNo].filter(Boolean).join(" / "),
      billUrl: r.billUrl ?? "",
      note: r.note ?? ""
    }));
  }

  return (
    <div className="card overflow-x-auto">
      <div className="flex justify-end mb-3">
        <button
          onClick={() => downloadCSV(`${kind}.csv`, toRows(), headers)}
          className="btn btn-outline"
        >
          Export CSV
        </button>
      </div>
      <table className="table-dark">
        <thead>
          <tr>
            {(kind === "incomes"
              ? ["วันที่","แหล่งรายรับ","จำนวน","ผู้ให้","ผู้รับ","หลักฐาน","หมายเหตุ"]
              : ["วันที่","รายการ","ประเภท","จำนวน","ผู้จ่าย","ร้าน/เลขใบเสร็จ","หลักฐาน","หมายเหตุ"]
            ).map((h)=> <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {records.map((r)=> (
            <tr key={r.id}>
              <td>{r.date?.toDate ? format(r.date.toDate(), "dd/MM/yyyy HH:mm") : ""}</td>
              {kind === "incomes" ? (
                <>
                  <td>{r.source}</td>
                  <td>{Number(r.amount||0).toLocaleString()}</td>
                  <td>{r.payerFrom}</td>
                  <td>{r.receiverTo}</td>
                  <td>{r.receiptUrl ? <a className="underline" href={r.receiptUrl} target="_blank">ดูรูป</a> : "-"}</td>
                  <td>{r.note||""}</td>
                </>
              ) : (
                <>
                  <td>{r.itemName}</td>
                  <td>{r.category}</td>
                  <td>{Number(r.amount||0).toLocaleString()}</td>
                  <td>{r.payer}</td>
                  <td>{[r.vendor,r.invoiceNo].filter(Boolean).join(" / ")||"-"}</td>
                  <td>{r.billUrl ? <a className="underline" href={r.billUrl} target="_blank">ดูรูป</a> : "-"}</td>
                  <td>{r.note||""}</td>
                </>
              )}
            </tr>
          ))}
          {records.length===0 && (
            <tr>
              <td colSpan={8} className="text-center muted py-6">ยังไม่มีรายการ</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
