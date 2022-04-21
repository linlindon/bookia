import Tags from "./pages/tags";
import Notes from "./pages/notes";
import BookNote from "./pages/booknote";
import SearchBook from "./pages/searchBook";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="search" element={<SearchBook />} />
          <Route path="alltags" element={<Tags />} />
          <Route path="booknote" element={<BookNote />} />
          <Route path="booknote/:id" element={<BookNote />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
