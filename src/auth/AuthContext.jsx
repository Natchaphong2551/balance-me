import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);   // undefined=กำลังตรวจสอบ, null=ไม่ล็อกอิน, object=ล็อกอิน
  const [profile, setProfile] = useState(null);  // เอกสาร users/{uid}

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setProfile(snap.exists() ? snap.data() : null);
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);

  // สมัครสมาชิก + บันทึกโปรไฟล์
  async function registerWithProfile({
    studentId, password, prefix, firstName, lastName, nickname, className,
  }) {
    const email = `${studentId}@balance-me.local`; // อีเมลเทียม
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const data = {
      studentId, prefix, firstName, lastName, nickname, className,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", uid), data);
    setProfile(data);
  }

  // ล็อกอินด้วยเลขประจำตัว
  async function loginWithId(studentId, password) {
    const email = `${studentId}@balance-me.local`;
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    profile,               // ใช้ดึงชื่อเล่น/ชั้น ไปแสดงในแบบฟอร์มผู้กรอก
    registerWithProfile,
    loginWithId,
    logout,
  };

  return <AuthCtx.Provider value={value}>{user === undefined ? null : children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
