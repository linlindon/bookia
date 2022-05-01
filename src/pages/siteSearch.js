import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { Search } from "@styled-icons/bootstrap/Search";
import { UserProfile } from "../App";
import Book from "../components/Book";
import NoteBox from "../components/NoteBox";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
  margin: 10px;
`;

const Button = styled.button`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
  background-color: ${(props) => (props.active ? "red" : "white")};
`;

const SearchForm = styled.form`
  display: flex;
  width: 80%;
  border-bottom: solid 2px black;
`;

const SearchInput = styled.input`
  font-size: 15px;
  border: none;
  width: 100%;

  &::placeholder {
    color: "red";
  }
`;
const SearchIcon = styled(Search)`
  width: 6%;
  color: green;
`;

let booksData = [];
let notesData = [];
function SiteSearch() {
  const [searchType, setSearchType] = useState("book");
  const [searchInput, setSearchInput] = useState([]);
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [searchNoteResults, setSearchNoteResults] = useState([]);
  const [isData, setIsData] = useState(true);
  const userId = useContext(UserProfile);
  console.log("inside func ===>", booksData, notesData);
  useEffect(() => {
    console.log("use effect");
    booksData = [];
    notesData = [];
    firebase.getBooksData(userId).then((data) => {
      data.forEach((book) => {
        booksData.push(book.data());
      });
    });
    firebase.getAllNotesData(userId).then((data) => {
      data.forEach((note) => {
        notesData.push(note.data());
      });
    });
  }, []);

  function searchData(e) {
    e.preventDefault();

    setIsData(true);
    if (!searchType) {
      alert("請先選擇要搜尋的項目");
    } else if (!searchInput) {
      return;
    } else if (searchInput.replace(/\s*/g, "").length === 0) {
      alert("請輸入要搜尋的文字");
    } else {
      let inputWordArray = searchInput.split(" ");
      let filterData = [];
      if (searchType === "book") {
        inputWordArray.forEach((word) => {
          filterData = booksData.filter((book) => {
            return book.title.includes(word);
          });
        });
        setSearchBookResults(filterData);
      } else if (searchType === "note") {
        // 如何做到同時包含array裡面的所有字
        filterData = notesData.filter((note) => {
          inputWordArray.forEach((word) => {
            return note.content.includes(word);
          });
        });
        setSearchNoteResults(filterData);
      }
      if (filterData.length === 0) {
        setIsData(false);
      }
      console.log("book", booksData);
      console.log("note", notesData);
    }
  }

  function searchTypeHandler(type) {
    setSearchType(type);
  }

  return (
    <>
      <SearchContainer>
        <ButtonContainer>
          <Button
            active={searchType === "book"}
            onClick={() => setSearchType("book")}
          >
            搜尋站內書籍
          </Button>

          <Button
            active={searchType === "note"}
            onClick={() => setSearchType("note")}
          >
            搜尋筆記
          </Button>
        </ButtonContainer>
        <SearchForm onSubmit={(e) => searchData(e)}>
          <SearchInput
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="請輸入關鍵字"
          />
          <SearchIcon onClick={searchData} />
        </SearchForm>
      </SearchContainer>
      {isData ? "" : <h3>無相關資料</h3>}
      {searchBookResults && <Book bookDatas={searchBookResults} />}
      {searchNoteResults && (
        <NoteBox bookNotesData={searchNoteResults} isData={isData} />
      )}
    </>
  );
}

export default SiteSearch;
