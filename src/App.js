import { useState, createContext, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Tags from "./pages/tags";
import Books from "./pages/books";
import BookNote from "./pages/bookNote";
import LibrarySearch from "./pages/librarySearch";
import Header from "./components/Header";
import Login from "./pages/login";
import SiteSearch from "./pages/siteSearch";
import backgroundImg from "./image/background.jpg";
import NoPage from "./pages/noPage";
import LoadingModal from "./components/modal/LoadingModal";

const UserProfile = createContext();

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

function RequireAuth({ children, loginState }) {
  let location = useLocation();
  // 會導回你當初登入的頁面。children指的就是被RequireAuth包住的所有東西(路徑)
  if (loginState === 0) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else if (loginState === 1) {
    return <LoadingModal />;
  }
  return children;
}

function App() {
  const [loginState, setLoginState] = useState(1);
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
        setLoginState(2);
        setUserId(user.uid);
      } else {
        setLoginState(0);
      }
    });
  }, [userId]);

  return (
    <>
      <Background>
        <BrowserRouter>
          <UserProfile.Provider value={userId}>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route element={<Header />}>
                <Route
                  path="books"
                  element={
                    <RequireAuth loginState={loginState}>
                      <Books />
                    </RequireAuth>
                  }
                />

                <Route
                  path="library-search"
                  element={
                    <RequireAuth loginState={loginState}>
                      <LibrarySearch />
                    </RequireAuth>
                  }
                />
                <Route
                  path="site-search"
                  element={
                    <RequireAuth loginState={loginState}>
                      <SiteSearch />
                    </RequireAuth>
                  }
                />
                <Route
                  path="tags"
                  element={
                    <RequireAuth loginState={loginState}>
                      <Tags />
                    </RequireAuth>
                  }
                />
                <Route
                  path="booknote"
                  element={
                    <RequireAuth loginState={loginState}>
                      <BookNote />
                    </RequireAuth>
                  }
                />
                <Route
                  path="booknote/:id"
                  element={
                    <RequireAuth loginState={loginState}>
                      <BookNote />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </UserProfile.Provider>
        </BrowserRouter>
      </Background>
    </>
  );
}

export { App, UserProfile };
