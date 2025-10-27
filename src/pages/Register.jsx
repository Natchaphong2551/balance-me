import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const { registerWithId } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!/^[0-9]{5}$/.test(id)) return setErr("เลขประจำตัวต้องเป็นตัวเลข 5 หลัก");
    if (pass.length < 6) return setErr("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    if (pass !== confirmPass) return setErr("รหัสผ่านไม่ตรงกัน");

    try {
      await registerWithId(id, pass);
      nav("/", { replace: true });
    } catch {
      setErr("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0f1a] via-[#1b082a] to-[#12071b] text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-black/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
          สมัครสมาชิก
        </h1>
        {err && <p className="text-red-400 text-sm mb-2 text-center">{err}</p>}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="เลขประจำตัว 5 หลัก"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="input-custom"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="input-custom"
          />
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="input-custom"
          />
          <button type="submit" className="btn-primary">สมัครสมาชิก</button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-400">
          มีบัญชีแล้ว?{" "}
          <Link to="/login" className="text-purple-400 hover:text-fuchsia-400">
            เข้าสู่ระบบ
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
