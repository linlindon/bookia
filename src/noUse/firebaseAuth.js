import { initializeApp } from "firebase/app";
import {
  getAuth,
  userCrendential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
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
  // SignUpHandler(email, password, name) {
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((res) => {
  //       const ref = doc(newUserRef);
  //       setDoc(ref, {
  //         name: name,
  //         id: res.user.uid,
  //         email: email,
  //         tagGroups: [],
  //       }).then(() => {
  //         alert("註冊成功");
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // },
};
export default memberManage;
