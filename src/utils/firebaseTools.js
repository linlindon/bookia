import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getDoc, updateDoc, setDoc } from "firebase/firestore";
import {
  getAuth,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersRef = collection(db, "users");
const auth = getAuth();

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
  async updateNoteTag(userId, noteId, tagsArray) {
    const notesRef = collection(usersRef, userId, "notes");
    await updateDoc(doc(notesRef, noteId), { tagNames: tagsArray });
  },
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
  async deleteNote(userId, noteId) {
    const noteRef = doc(collection(usersRef, userId, "notes"), noteId);
    await deleteDoc(noteRef);
  },
  async deleteBook(userId, bookId) {
    const booksRef = doc(db, "users", userId, "books", bookId);
    await deleteDoc(booksRef);
  },
  async searchBookTitle(userId, keywords) {
    const newBookRef = collection(db, "users", userId, "books");
    // const q = query(newBookRef, where("title", "==", keywords));
    // return await getDocs(q);
  },
  queryNotesByTag(userId, tagName) {
    const notesRef = collection(usersRef, userId, "notes");
    const queryResults = query(
      notesRef,
      where("tagNames", "array-contains", tagName)
    );
    return getDocs(queryResults).then((res) => {
      return res;
    });
  },
  queryBooksByTag(userId, tagName) {
    const bookRef = collection(db, "users", userId, "books");
    const queryResults = query(
      bookRef,
      where("tagNames", "array-contains", tagName)
    );
    return getDocs(queryResults).then((res) => {
      return res;
    });
  },
  SignUpHandler(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password)
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
  LoginHandler(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res.user);
        alert("登入成功");
        return res.user;
      })
      .catch((error) => {
        alert(error);
        // const errorCode = error.code;
        // const errorMessageArray = Object.keys(errorMessageList);
        // let message = errorMessageArray.filter((item) => item === errorCode);
        // let x = message[0];
        // alert(errorMessageList[x]);
      });
  },
  LogoutHandler() {
    return signOut(auth)
      .then(() => {
        alert("您已成功登出");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export default firebase;
