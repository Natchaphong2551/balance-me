import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const { loginWithId } = useAuth();
  const nav = useNavigate();
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!/^[0-9]{5}$/.test(id)) return setErr("เลขประจำตัวต้องเป็นตัวเลข 5 หลัก");
    try {
      await loginWithId(id, pass);
      nav("/", { replace: true });
    } catch {
      setErr("เลขประจำตัวหรือรหัสผ่านไม่ถูกต้อง");
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
          เข้าสู่ระบบ Balance Me
        </h1>
        {err && <p className="text-red-400 text-sm mb-2 text-center">{err}</p>}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="เลขประจำตัว 5 หลัก"
            className="input-custom"
          />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="รหัสผ่าน"
            className="input-custom"
          />
          <button type="submit" className="btn-primary">เข้าสู่ระบบ</button>
        </form>
        <p className="text-center text-sm mt-6 text-gray-400">
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="text-purple-400 hover:text-fuchsia-400">
            สมัครสมาชิก
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
