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
import Notes from "./pages/notes";
import SearchBook from "./pages/searchBook";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

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
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="search" element={<SearchBook />} />
          <Route path="alltags" element={<Tags />} />
        </Routes>
      </BrowserRouter>
      {/* <SearchBookTitle />
      <Card /> */}
      {/* <Tags /> */}
      {/* <Notes /> */}
    </>
  );
}

export default App;
