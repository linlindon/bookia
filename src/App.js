import { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Tags from "./pages/tags";
import Books from "./pages/books";
import BookNote from "./pages/bookNote";
import SearchBook from "./pages/searchBook";
import Header from "./components/Header";
import Login from "./pages/login";
import SiteSearch from "./pages/siteSearch";
import backgroundImg from "./img/background.jpg";
import Loading from "./components/Loading";

const UserProfile = createContext();

const LoadingContainer = styled.div`
  margin-top: 100px;
`;

const Background = styled.div`
  position: relative;
  &::after {
    content: " ";
    position: absolute;
    top: 0;
    opacity: 0.3;
    background-image: url(${backgroundImg});
    background-size: cover;
    background-position: 0px -250px;
    height: 100vh;
    width: 100%;
    z-index: -1;
  }
`;

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
  const [user, loading, error] = useAuthState(auth);

  // useEffect(() => {
  //   const test = () => {
  //     if (loading) {
  //       setIsLoading(true);
  //       console.log("loading");
  //     }
  //     if (error) {
  //       console.log(error);
  //     }
  //     if (user) {
  //       console.log("login", user.uid);
  //       setLoginState(true);
  //       setUserId(user.uid);
  //     }
  //   };
  //   test();
  // }, []);

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
      <Background>
        <BrowserRouter>
          <UserProfile.Provider value={userId}>
            {loginState && <Header loginState={loginState} />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="books"
                element={
                  loginState ? (
                    <Books />
                  ) : (
                    <Navigate to="/login" replace={true} />
                  )
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
                  loginState ? (
                    <Tags />
                  ) : (
                    <Navigate to="/login" replace={true} />
                  )
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
                  loginState ? (
                    <Navigate to="/books" replace={true} />
                  ) : (
                    <Login />
                  )
                }
              />
            </Routes>
          </UserProfile.Provider>
        </BrowserRouter>
      </Background>
    </>
  );
}

export { App, UserProfile };
