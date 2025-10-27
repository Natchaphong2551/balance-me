import React, { useEffect, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { useAuth } from "../auth/AuthContext";
import PopupSuccess from "./PopupSuccess";

/** คืนค่า {datePart:'YYYY-MM-DD', timePart:'HH:MM'} เป็นเวลาโลคัล */
function nowLocalParts() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return {
    datePart: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    timePart: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}
/** รวม datePart + timePart (โลคัล) เป็น Date */
function combineLocal(datePart, timePart) {
  const [y, m, d] = (datePart || "").split("-").map(Number);
  const [hh, mm]  = (timePart || "").split(":").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

export function RecordForm({ projectId, kind }) {
  const { profile } = useAuth(); // { nickname, className, ... }
  const { datePart: initDate, timePart: initTime } = nowLocalParts();
  const [datePart, setDatePart] = useState(initDate);
  const [timePart, setTimePart] = useState(initTime);

  const [amount, setAmount] = useState("");

  // income fields
  const [source, setSource] = useState("");
  const [fromWho, setFromWho] = useState("");
  const [receiver, setReceiver] = useState("");

  // expense fields
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("วัสดุ");
  const [payer, setPayer] = useState("");
  const [vendor, setVendor] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const fileRef = useRef();
  const [showPopup, setShowPopup] = useState(false);

  // รีเซ็ตเมื่อสลับโครงการ/แท็บ แต่คงวันที่/เวลาเป็นตอนนี้
  useEffect(() => {
    const now = nowLocalParts();
    setDatePart(now.datePart);
    setTimePart(now.timePart);
    clearOnlyInputs();
  }, [projectId, kind]);

  function clearOnlyInputs() {
    setAmount("");
    setSource(""); setFromWho(""); setReceiver("");
    setItemName(""); setCategory("วัสดุ"); setPayer("");
    setVendor(""); setInvoiceNo(""); setNote("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!projectId) return;

    const dateObj = combineLocal(datePart, timePart);

    // อัปไฟล์ถ้ามี
    let uploadedUrl = null;
    if (file) {
      const path = `projects/${projectId}/${kind}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      uploadedUrl = await getDownloadURL(storageRef);
    }

    // ผู้กรอกข้อมูลตาม profile
    const enteredBy = profile ? `${profile.nickname} ${profile.className}` : "-";

    if (kind === "incomes") {
      await addDoc(collection(db, "projects", projectId, "incomes"), {
        date: dateObj,
        source: source.trim(),
        amount: Number(amount || 0),
        payerFrom: fromWho.trim(),
        receiverTo: receiver.trim(),
        note: note.trim(),
        receiptUrl: uploadedUrl,
        enteredBy,
        createdAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, "projects", projectId, "expenses"), {
        date: dateObj,
        itemName: itemName.trim(),
        category,
        amount: Number(amount || 0),
        payer: payer.trim(),
        vendor: vendor.trim() || null,
        invoiceNo: invoiceNo.trim() || null,
        note: note.trim() || null,
        billUrl: uploadedUrl,
        enteredBy,
        createdAt: serverTimestamp(),
      });
    }

    // โชว์ป๊อปอัป + เคลียร์ช่องกรอก (ยกเว้น วันที่/เวลา และผู้กรอก)
    setShowPopup(true);
    clearOnlyInputs();
  }

  return (
    <>
      <form onSubmit={onSubmit} className="card grid gap-3 mb-4">
        <h3 className="font-semibold">บันทึก{kind === "incomes" ? "รายรับ" : "รายจ่าย"}</h3>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm muted">วันที่</label>
            <input type="date" value={datePart} onChange={(e)=>setDatePart(e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-sm muted">เวลา</label>
            <input type="time" step="60" value={timePart} onChange={(e)=>setTimePart(e.target.value)} className="input" />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-300">
              ผู้กรอกข้อมูล:{" "}
              <span className="text-purple-400">
                {profile ? `${profile.nickname} ${profile.className}` : "..."}
              </span>
            </div>
          </div>
        </div>

        {kind === "incomes" ? (
          <>
            <label className="text-sm muted">แหล่งรายรับ (short)</label>
            <input value={source} onChange={(e)=>setSource(e.target.value)} className="input" placeholder="เช่น บริจาค, ระดมทุน, ขายของ"/>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm muted">จำนวนเงิน (บาท)</label>
                <input type="number" inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} className="input"/>
              </div>
              <div>
                <label className="text-sm muted">ผู้ให้ (รับเงินมาจากใคร)</label>
                <input value={fromWho} onChange={(e)=>setFromWho(e.target.value)} className="input"/>
              </div>
            </div>

            <label className="text-sm muted">ผู้รับ (ใครรับเงินเข้าบัญชี)</label>
            <input value={receiver} onChange={(e)=>setReceiver(e.target.value)} className="input"/>
          </>
        ) : (
          <>
            <label className="text-sm muted">รายการซื้อ</label>
            <input value={itemName} onChange={(e)=>setItemName(e.target.value)} className="input" placeholder="เช่น ผ้าไวนิล, สีทาฉาก"/>

            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm muted">ประเภทค่าใช้จ่าย</label>
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="select">
                  <option>วัสดุ</option>
                  <option>สวัสดิการอาหาร</option>
                  <option>อื่นๆ</option>
                </select>
              </div>
              <div>
                <label className="text-sm muted">จำนวนเงิน (บาท)</label>
                <input type="number" inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} className="input"/>
              </div>
              <div>
                <label className="text-sm muted">ผู้จ่าย (short)</label>
                <input value={payer} onChange={(e)=>setPayer(e.target.value)} className="input"/>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm muted">ชื่อร้านค้า (ถ้ามี)</label>
                <input value={vendor} onChange={(e)=>setVendor(e.target.value)} className="input"/>
              </div>
              <div>
                <label className="text-sm muted">เลขที่ใบเสร็จ (ถ้ามี)</label>
                <input value={invoiceNo} onChange={(e)=>setInvoiceNo(e.target.value)} className="input"/>
              </div>
            </div>
          </>
        )}

        <label className="text-sm muted">แนบหลักฐาน (รูปภาพ) — ไม่บังคับ</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="input"/>

        <label className="text-sm muted">หมายเหตุ (ถ้ามี)</label>
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} className="textarea" rows={3}></textarea>

        <button className="btn-primary">บันทึก{kind === "incomes" ? "รายรับ" : "รายจ่าย"}</button>
      </form>

      {showPopup && <PopupSuccess onClose={() => setShowPopup(false)} />}
    </>
  );
}
