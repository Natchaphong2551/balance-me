// src/lib/firestoreOps.js
import {
  collection, deleteDoc, doc, getDocs, writeBatch, query, limit
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { ref, listAll, deleteObject } from "firebase/storage";

const BATCH_LIMIT = 450; // เว้นเผื่อ 500/ครั้ง

async function deleteCollectionInBatches(colRef) {
  while (true) {
    const qLimited = query(colRef, limit(BATCH_LIMIT));
    const snap = await getDocs(qLimited);
    if (snap.empty) break;

    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();

    if (snap.size < BATCH_LIMIT) break; // ลบหมดแล้ว
  }
}

async function deleteStorageFolder(path) {
  // ลบไฟล์ในโฟลเดอร์นั้นทั้งหมด (listAll รองรับทั้ง items และ sub-folders)
  async function walkAndDelete(folderRef) {
    const res = await listAll(folderRef);
    // ลบไฟล์
    await Promise.all(res.items.map(item => deleteObject(item)));
    // ไล่ subfolders
    await Promise.all(res.prefixes.map(p => walkAndDelete(p)));
  }
  try {
    await walkAndDelete(ref(storage, path));
  } catch (e) {
    // ถ้าโฟลเดอร์ไม่มีไฟล์จะ listAll ไม่เจอ — ข้ามได้
    if (import.meta.env.DEV) console.debug("deleteStorageFolder:", e?.message);
  }
}

export async function deleteProjectDeep(projectId) {
  // 1) ลบ subcollections (incomes, expenses)
  const incomesRef = collection(db, "projects", projectId, "incomes");
  const expensesRef = collection(db, "projects", projectId, "expenses");
  await deleteCollectionInBatches(incomesRef);
  await deleteCollectionInBatches(expensesRef);

  // 2) ลบไฟล์ Storage ที่เกี่ยวข้อง
  await deleteStorageFolder(`projects/${projectId}/incomes`);
  await deleteStorageFolder(`projects/${projectId}/expenses`);

  // 3) ลบเอกสารโปรเจกต์
  await deleteDoc(doc(db, "projects", projectId));
}
