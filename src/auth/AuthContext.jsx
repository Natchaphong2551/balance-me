import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function registerWithId(studentId, password) {
    const fakeEmail = `${studentId}@balance-me.local`;
    return createUserWithEmailAndPassword(auth, fakeEmail, password);
  }

  async function loginWithId(studentId, password) {
    const fakeEmail = `${studentId}@balance-me.local`;
    return signInWithEmailAndPassword(auth, fakeEmail, password);
  }

  async function logout() {
    return signOut(auth);
  }

  const value = {
    user,
    loading,
    registerWithId,
    loginWithId,
    logout,
  };

  return (
    <AuthCtx.Provider value={value}>
      {!loading && children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
