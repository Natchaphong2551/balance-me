import React, { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { motion } from "framer-motion";

function getStudentIdFromEmail(email = "") {
  return email.split("@")[0] || "";
}

export default function Profile() {
  const { user, profile, logout } = useAuth();

  const studentId = useMemo(() => getStudentIdFromEmail(user?.email || ""), [user]);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onChangePassword(e) {
    e.preventDefault();
    setMsg(""); setErr("");

    if (!/^[0-9]{5}$/.test(studentId)) return setErr("ไม่พบเลขประจำตัวผู้ใช้ที่ถูกต้อง");
    if (!currentPass) return setErr("กรอกรหัสผ่านเดิมก่อน");
    if (newPass.length < 6) return setErr("รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร");
    if (newPass !== confirmPass) return setErr("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");

    try {
      setBusy(true);
      const cred = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);

      setMsg("เปลี่ยนรหัสผ่านสำเร็จ");
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
    } catch (e) {
      const message =
        e?.code === "auth/wrong-password" ? "รหัสผ่านเดิมไม่ถูกต้อง" :
        e?.code === "auth/too-many-requests" ? "พยายามมากเกินไป โปรดลองใหม่ภายหลัง" :
        e?.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ";
      setErr(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .35 }}
        className="w-full max-w-lg bg-black/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 text-white"
      >
        <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
          โปรไฟล์ผู้ใช้
        </h1>
        <p className="muted text-sm mb-6">จัดการบัญชีผู้ใช้ของคุณในระบบ Balance Me</p>

        <div className="grid gap-3 mb-6">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm text-gray-400">เลขประจำตัว</div>
            <div className="col-span-2 font-semibold">{studentId || "-"}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm text-gray-400">ชื่อเล่น / ชั้น</div>
            <div className="col-span-2 font-medium">
              {profile ? `${profile.nickname} ${profile.className}` : "-"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm text-gray-400">UID</div>
            <div className="col-span-2 text-xs break-all text-gray-400">{user?.uid}</div>
          </div>
        </div>

        <div className="border-t border-white/10 my-5"></div>

        <h2 className="text-lg font-semibold mb-3">เปลี่ยนรหัสผ่าน</h2>

        {msg && <div className="good text-sm mb-3">{msg}</div>}
        {err && <div className="bad text-sm mb-3">{err}</div>}

        <form onSubmit={onChangePassword} className="grid gap-3">
          <input
            type="password"
            className="input-custom"
            placeholder="รหัสผ่านเดิม"
            value={currentPass}
            onChange={(e)=>setCurrentPass(e.target.value)}
          />
          <input
            type="password"
            className="input-custom"
            placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
            value={newPass}
            onChange={(e)=>setNewPass(e.target.value)}
          />
          <input
            type="password"
            className="input-custom"
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPass}
            onChange={(e)=>setConfirmPass(e.target.value)}
          />

          <div className="flex items-center gap-2 pt-1">
            <button type="submit" className="btn-primary disabled:opacity-60" disabled={busy}>
              {busy ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
            </button>
            <button type="button" className="pill hover:bg-white/5" onClick={logout}>
              ออกจากระบบ
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
