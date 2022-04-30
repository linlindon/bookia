import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { Search } from "@styled-icons/bootstrap/Search";
import { UserProfile } from "../App";
import Book from "../components/Book";

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
  ${"" /* background-color: ${(props) => props.activeOn}; */}
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

// let bookTitleArray = [];
let bookData = [];
function SiteSearch() {
  const [searchType, setSearchType] = useState("");
  const [change, setChange] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [searchNoteResults, setSearchNoteResults] = useState([]);
  const [isData, setIsData] = useState(true);
  const userId = useContext(UserProfile);

  useEffect(() => {
    // bookTitleArray = [];
    bookData = [];
    firebase.getBooksData(userId).then((data) => {
      data.forEach((book) => {
        // bookTitleArray.push(book.data().title);
        bookData.push(book.data());
      });
      // console.log(bookData);
    });
  }, []);

  function searchData(e) {
    e.preventDefault();

    console.log(searchInput);

    if (!searchType) {
      alert("請先選擇要搜尋的項目");
    } else if (!searchInput) {
      return;
    } else if (searchType === "book") {
      bookData = bookData.filter((book) => {
        return book.title.includes(searchInput);
      });
      setSearchBookResults(bookData);
      console.log(bookData);
      // bookData.forEach((book) => {
      //   if (book.title.includes(searchInput)) {
      //     setSearchBookResults()
      //   }
      // });
    }
    if (!searchBookResults) {
      setIsData(false);
    }
  }

  function searchTypeHandler(type) {
    setSearchType(type);
    setChange(true);
  }
  function searchTypeHandler(e) {
    console.log(e);
    // (e) => searchTypeHandler(e.target.value)
  }

  return (
    <>
      <SearchContainer>
        <ButtonContainer>
          <Button onClick={() => setSearchType("book")} change={change}>
            搜尋站內書籍
          </Button>

          <Button onClick={() => setSearchType("note")} change={change}>
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
    </>
  );
}

export default SiteSearch;
