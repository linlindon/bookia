import Tags from "./pages/tags";
import Notes from "./pages/notes";
import NewNote from "./pages/newNote";
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
          <Route path="newnote" element={<NewNote />} />
          <Route path="alltags" element={<Tags />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
