import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";
import SearchBar from "../components/Search";
import Book from "../components/Book";
import Note from "../components/Note";

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
  border: none;
  margin: 20px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 600;

  border-radius: 5px;
  background-color: ${(props) => (props.active ? "#3fccdc" : "white")};
`;

const Title = styled.h3`
  font-size: 16px;
`;

let booksData = [];
let notesData = [];
function SiteSearch() {
  const [searchType, setSearchType] = useState("book");
  const [searchInput, setSearchInput] = useState([]);
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [searchNoteResults, setSearchNoteResults] = useState([]);
  const [isData, setIsData] = useState(true);
  const [isRender, setIsRender] = useState(true);
  const userId = useContext(UserProfile);
  // console.log("inside func ===>", booksData, notesData);
  // console.log("outside", searchInput);

  useEffect(() => {
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

  useEffect(() => {
    setSearchBookResults([]);
    setSearchNoteResults([]);
    function searchData() {
      console.log("inside", searchInput);
      if (searchInput.length === 0) {
        // console.log("no input length");
        return;
      } else {
        setIsData(true);
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
          notesData.forEach((note) => {
            inputWordArray.every((word) => {
              if (note.content.includes(word)) {
                filterData.push(note);
              } else {
                console.log("no match keyowrd content");
              }
            });
          });

          filterData = notesData.filter((note) => {
            console.log(note.content);
            return inputWordArray.every((word) => {
              console.log(word);
              console.log(note.content.includes(word));
              return note.content.includes(word);
            });
          });
          console.log(filterData);
          setSearchNoteResults(filterData);
        }
        if (filterData.length === 0) {
          setIsData(false);
        }
        console.log("book", booksData);
        console.log("note", notesData);
      }
    }
    searchData();
  }, [searchInput, isRender]);

  function searchTypeHandler(type) {
    console.log("handler", searchInput);
    setIsData(true);
    setSearchBookResults([]);
    setSearchNoteResults([]);
    setSearchType(type);
  }

  return (
    <>
      <SearchContainer>
        <ButtonContainer>
          <Button
            active={searchType === "book"}
            onClick={() => searchTypeHandler("book")}
          >
            搜尋站內書籍
          </Button>

          <Button
            active={searchType === "note"}
            onClick={() => searchTypeHandler("note")}
          >
            搜尋筆記
          </Button>
        </ButtonContainer>

        <SearchBar
          searchType={searchType}
          setSearchInput={setSearchInput}
          setIsRender={setIsRender}
        />
        {isData ? null : <Title>無相關資料</Title>}
        {searchBookResults.length !== 0 && (
          <Book bookDatas={searchBookResults} />
        )}
        {searchNoteResults.length !== 0 && (
          <Note notesBoxData={searchNoteResults} />
        )}
      </SearchContainer>
    </>
  );
}

export default SiteSearch;
