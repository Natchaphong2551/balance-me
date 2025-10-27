import React from "react";
import { motion } from "framer-motion";

export default function PopupSuccess({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-gradient-to-b from-purple-700 to-fuchsia-700 text-white rounded-2xl p-6 shadow-2xl text-center w-[90%] max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-3">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
        <button onClick={onClose} className="btn-primary w-full">ตกลง</button>
      </motion.div>
    </div>
  );
}
