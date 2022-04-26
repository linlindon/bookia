import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection } from "firebase/firestore";
import { getDoc, updateDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM3IamCWyJi_8vyVPP34KUixJJKXlAwQ8",
  authDomain: "bookia-280d8.firebaseapp.com",
  projectId: "bookia-280d8",
  storageBucket: "bookia-280d8.appspot.com",
  messagingSenderId: "330107513484",
  appId: "1:330107513484:web:b81b9e8f3748a595dd69a9",
};

const userID = "E5EiDYKVIUd0wuHie6N5";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const notesRef = collection(db, "users", userID, "notes");
const booksRef = collection(db, "users", userID, "books");

const firebase = {
  getTagGroupsData(userId) {
    const userRef = doc(usersRef, userId);
    return getDoc(userRef).then((res) => {
      return res.data();
    });
  },

  getNoteData(userId, noteId) {
    const notesRef = collection(usersRef, userId, "notes");
    return getDoc(doc(notesRef, noteId)).then((res) => {
      return res.data();
    });
  },
  getBookInfo(userId, bookId) {
    const booksRef = collection(db, "users", userId, "books");
    return getDoc(doc(booksRef, bookId)).then((res) => {
      return res.data();
    });
  },
  updateBookTags(userId, bookId, tagsArray) {
    const booksRef = collection(db, "users", userId, "books");
    updateDoc(doc(booksRef, bookId), { tagNames: tagsArray });
  },
  async updateNote(userId, noteId, data) {
    const notesRef = collection(usersRef, userId, "notes");
    await setDoc(doc(notesRef, noteId), data);
  },
  addNewBook(userId, data) {
    const newBookRef = doc(collection(db, "users", userId, "books"));
    return setDoc(newBookRef, data).then((res) => {});
  },
};

export default firebase;
