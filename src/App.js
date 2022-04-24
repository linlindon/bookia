import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tags from "./pages/tags";
import Books from "./pages/books";
import BookNote from "./pages/booknote";
import SearchBook from "./pages/searchBook";
import Header from "./components/Header";
import Login from "./pages/login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="search" element={<SearchBook />} />
          <Route path="alltags" element={<Tags />} />
          <Route path="booknote" element={<BookNote />} />
          <Route path="booknote/:id" element={<BookNote />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
