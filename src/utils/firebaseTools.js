import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, getDocs } from "firebase/firestore";
import { getDoc, updateDoc, setDoc } from "firebase/firestore";
import {
  getAuth,
  userCrendential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
const auth = getAuth();
// const userId = auth.currentUser.uid;
const notesRef = collection(db, "users", userID, "notes");
const booksRef = collection(db, "users", userID, "books");

const firebase = {
  getTagGroupsData(userId) {
    const userRef = doc(usersRef, userId);
    return getDoc(userRef).then((res) => {
      return res.data();
    });
  },
  async updateTagGroup(userId, data) {
    await updateDoc(doc(usersRef, userId), {
      tagGroups: data,
    });
  },

  getAllNotesData(userId) {
    const notesRef = collection(usersRef, userId, "notes");
    return getDocs(notesRef).then((res) => {
      return res;
    });
  },
  getNoteData(userId, noteId) {
    const notesRef = collection(usersRef, userId, "notes");
    return getDoc(doc(notesRef, noteId)).then((res) => {
      return res.data();
    });
  },
  getBooksData(userId) {
    const booksRef = collection(db, "users", userId, "books");
    return getDocs(booksRef).then((res) => {
      return res;
    });
  },
  getBookInfo(userId, bookId) {
    const booksRef = collection(db, "users", userId, "books");
    return getDoc(doc(booksRef, bookId)).then((res) => {
      return res.data();
    });
  },
  async updateBookTags(userId, bookId, tagsArray) {
    const booksRef = collection(db, "users", userId, "books");
    await updateDoc(doc(booksRef, bookId), { tagNames: tagsArray });
  },
  // async updateNote(userId, noteId, data) {
  //   const notesRef = collection(usersRef, userId, "notes");
  //   await setDoc(doc(notesRef, noteId), data);
  // },
  async addNewNote(userId, data, noteId) {
    const notesRef = collection(usersRef, userId, "notes");
    const newNoteRef = doc(notesRef);
    if (!noteId) {
      data = { ...data, id: newNoteRef.id };
      await setDoc(newNoteRef, data);
    } else {
      await setDoc(doc(notesRef, noteId), data);
    }
  },
  setNewBookRef(userId) {
    const newBookRef = doc(collection(db, "users", userId, "books"));
    return newBookRef.id;
  },
  async addNewBook(userId, bookId, data) {
    const newBookRef = collection(db, "users", userId, "books");
    data = { ...data, id: bookId };
    await setDoc(doc(newBookRef, bookId), data);
  },

  SignUpHandler(email, password, name) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const ref = doc(usersRef, res.user.uid);
        setDoc(ref, {
          name: name,
          id: res.user.uid,
          email: email,
          tagGroups: [],
        }).then(() => {
          alert("註冊成功");
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export default firebase;
