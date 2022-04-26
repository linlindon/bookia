import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Redirect,
} from "react-router-dom";
import { NavLink } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Tags from "./pages/tags";
import Books from "./pages/books";
import BookNote from "./pages/booknote";
import SearchBook from "./pages/searchBook";
import Header from "./components/Header";
import Login from "./pages/login";

function App() {
  const [loginState, setLoginState] = useState(false);
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
  onAuthStateChanged(auth, (user) => {
    console.log(user.uid);
    if (user) {
      setLoginState(true);
      console.log("login true");
    } else {
      setLoginState(false);
      console.log("not login");
    }
  });
  return (
    <>
      <BrowserRouter>
        <Header loginState={loginState} />
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="search" element={<SearchBook />} />
          <Route path="alltags" element={<Tags />} />
          <Route path="booknote" element={<BookNote />} />
          <Route path="booknote/:id" element={<BookNote />} />
          <Route
            path="login"
            // element={<Login />}

            element={loginState ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
