import Tags from "./pages/tags";
import Notes from "./pages/notes";
import BookNote from "./pages/BookNote";
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
          <Route path="newnote" element={<BookNote />} />
          <Route path="alltags" element={<Tags />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
