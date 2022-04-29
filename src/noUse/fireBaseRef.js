import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM3IamCWyJi_8vyVPP34KUixJJKXlAwQ8",
  authDomain: "bookia-280d8.firebaseapp.com",
  projectId: "bookia-280d8",
  storageBucket: "bookia-280d8.appspot.com",
  messagingSenderId: "330107513484",
  appId: "1:330107513484:web:b81b9e8f3748a595dd69a9",
};
const userID = "E5EiDYKVIUd0wuHie6N5";

function ref(id) {
  return collection(db, "users", id, "tags");
}
// x = ref(id)
// setDoc(x,...)
// const app = initializeApp(firebaseConfig);
const db = getFirestore();
const tagGroupsRef = collection(db, "users", userID, "tagGroups");
const tagsRef = collection(db, "users", userID, "tags");
const notesRef = collection(db, "users", userID, "notes");
const booksRef = collection(db, "users", userID, "books");
const newBookRef = doc(booksRef);
const userRef = doc(db, "users", userID);
const newUserRef = collection(db, "users");
// export {
//   tagsRef,
//   tagGroupsRef,
//   notesRef,
//   booksRef,
//   userRef,
//   newBookRef,
//   newUserRef,
// };

const api = {
  geData(userID, docId, data) {
    const notesRef = collection(db, "users", userID, "notes");
    setDoc(doc(notesRef, docId), data);
  },
};
