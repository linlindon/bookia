import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  doc,
  collectionGroup,
  query,
  where,
  setDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import Card from "./components/Card";
import SearchBookTitle from "./pages/searchBook";
import Tags from "./pages/tags";

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

function App() {
  return (
    <>
      {/* <SearchBookTitle />
      <Card /> */}
      <Tags />
    </>
  );
}

export default App;
