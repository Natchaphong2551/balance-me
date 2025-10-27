import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const { registerWithProfile } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    studentId: "",
    password: "",
    confirmPass: "",
    prefix: "",
    firstName: "",
    lastName: "",
    nickname: "",
    className: "",
  });
  const [err, setErr] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const { studentId, password, confirmPass, prefix, firstName, lastName, nickname, className } = form;
    if (!/^[0-9]{5}$/.test(studentId)) return setErr("เลขประจำตัวต้องเป็นตัวเลข 5 หลัก");
    if (!prefix || !firstName || !lastName || !nickname || !className) return setErr("กรอกข้อมูลให้ครบทุกช่อง");
    if (password.length < 6) return setErr("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    if (password !== confirmPass) return setErr("รหัสผ่านไม่ตรงกัน");

    try {
      await registerWithProfile(form);
      nav("/", { replace: true });
    } catch (e) {
      setErr("สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0f1a] via-[#1b082a] to-[#12071b] text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
          สมัครสมาชิก
        </h1>
        {err && <p className="text-red-400 text-sm mb-3 text-center">{err}</p>}

        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid grid-cols-3 gap-2">
            <select name="prefix" className="input-custom" value={form.prefix} onChange={handleChange}>
              <option value="">คำนำหน้า</option>
              <option>นาย</option>
              <option>นางสาว</option>
            </select>
            <input name="firstName" placeholder="ชื่อจริง" className="input-custom" value={form.firstName} onChange={handleChange} />
            <input name="lastName" placeholder="นามสกุล" className="input-custom" value={form.lastName} onChange={handleChange} />
          </div>

          <input name="nickname" placeholder="ชื่อเล่น" className="input-custom" value={form.nickname} onChange={handleChange} />

          <select name="className" className="input-custom" value={form.className} onChange={handleChange}>
            <option value="">เลือกชั้น</option>
            <option>5/3</option>
            <option>5/8</option>
            <option>6/1</option>
            <option>6/5</option>
            <option>6/17</option>
          </select>

          <input name="studentId" placeholder="เลขประจำตัว 5 หลัก" className="input-custom" value={form.studentId} onChange={handleChange} />
          <input name="password" type="password" placeholder="รหัสผ่าน" className="input-custom" value={form.password} onChange={handleChange} />
          <input name="confirmPass" type="password" placeholder="ยืนยันรหัสผ่าน" className="input-custom" value={form.confirmPass} onChange={handleChange} />

          <button type="submit" className="btn-primary">สมัครสมาชิก</button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-400">
          มีบัญชีแล้ว? <Link to="/login" className="text-purple-400 hover:text-fuchsia-400">เข้าสู่ระบบ</Link>
        </p>
      </motion.div>
    </div>
  );
}
