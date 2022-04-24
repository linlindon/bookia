import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, setDoc, doc } from "firebase/firestore";
import { newUserRef } from "./fireBaseRef";

const firebaseConfig = {
  apiKey: "AIzaSyBM3IamCWyJi_8vyVPP34KUixJJKXlAwQ8",
  authDomain: "bookia-280d8.firebaseapp.com",
  projectId: "bookia-280d8",
  storageBucket: "bookia-280d8.appspot.com",
  messagingSenderId: "330107513484",
  appId: "1:330107513484:web:b81b9e8f3748a595dd69a9",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const memberManage = {
  LogoutHandler() {
    signOut(auth)
      .then(() => {
        alert("您已成功登出");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  LoginHandler(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("登入成功");
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
  SignUpHandler(email, password, name) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const ref = doc(newUserRef);
        // console.log(ref.data());
        setDoc(ref, {
          name: name,
          id: ref.id,
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
export default memberManage;
