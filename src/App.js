import { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Tags from "./pages/tags";
import Books from "./pages/books";
import BookNote from "./pages/bookNote";
import SearchBook from "./pages/searchBook";
import Header from "./components/Header";
import Login from "./pages/login";
import SiteSearch from "./pages/siteSearch";

// import { UserProfile, UserProvider } from "./components/UserProfile";
const UserProfile = createContext();

function App() {
  const [loginState, setLoginState] = useState(false);
  const [userId, setUserId] = useState();
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginState(true);
        console.log(user.uid);
        setUserId(user.uid);
        console.log("login true");
      } else {
        setLoginState(false);
        console.log("not login");
      }
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <UserProfile.Provider value={userId}>
          {loginState && <Header loginState={loginState} />}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="books"
              element={
                loginState ? <Books /> : <Navigate to="/login" replace={true} />
              }
            />
            <Route
              path="search"
              element={
                loginState ? (
                  <SearchBook />
                ) : (
                  <Navigate to="/login" replace={true} />
                )
              }
            />
            <Route
              path="site-search"
              element={
                loginState ? (
                  <SiteSearch />
                ) : (
                  <Navigate to="/login" replace={true} />
                )
              }
            />
            <Route
              path="alltags"
              element={
                loginState ? <Tags /> : <Navigate to="/login" replace={true} />
              }
            />
            <Route
              path="booknote"
              element={
                loginState ? (
                  <BookNote />
                ) : (
                  <Navigate to="/login" replace={true} />
                )
              }
            />
            <Route
              path="booknote/:id"
              element={
                loginState ? (
                  <BookNote />
                ) : (
                  <Navigate to="/login" replace={true} />
                )
              }
            />
            <Route
              path="login"
              element={
                loginState ? <Navigate to="/books" replace={true} /> : <Login />
              }
            />
          </Routes>
        </UserProfile.Provider>
      </BrowserRouter>
    </>
  );
}

export { App, UserProfile };
