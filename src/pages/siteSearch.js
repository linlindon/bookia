import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";
import SearchBar from "../components/Search";
import Book from "../components/Book";
import Note from "../components/Note";
import Loading from "../components/Loading";

const PageTitle = styled.h1`
  marign-top: 5%;
  text-align: center;
  @media only screen and (max-width: 786px) {
    margin: 5px;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15%;
`;
const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
  margin: 20px;
`;

const Button = styled.button`
  border: none;
  width: 180px;
  height: 45px;
  margin-right: 15px;
  letter-spacing: 2px;
  text-align: center;
  margin: 20px;
  padding: 3px 8px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => (props.active ? "#dca246" : "#e6c88b")};
`;

const Title = styled.h3`
  font-size: 16px;
`;
const LoadingContainer = styled.div`
  margin-top: 50px;
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
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  // console.log("inside func ===>", booksData, notesData);
  console.log("outside", searchInput);

  useEffect(() => {
    booksData = [];
    notesData = [];
    if (userId) {
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
    }
  }, []);

  useEffect(() => {
    setSearchBookResults([]);
    setSearchNoteResults([]);
    function searchData() {
      console.log("inside", searchInput);

      setIsData(true);
      let inputWordArray = searchInput.split(" ");
      let filterData = [];
      if (searchType === "book") {
        inputWordArray.forEach((word) => {
          filterData = booksData.filter((book) => {
            return book.title.includes(word);
          });
        });
        setIsLoading(false);
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
          // console.log(note.content);
          return inputWordArray.every((word) => {
            // console.log(note.content.includes(word));
            return note.content.includes(word);
          });
        });
        // console.log(filterData);
        setIsLoading(false);
        setSearchNoteResults(filterData);
      }
      if (filterData.length === 0) {
        setIsData(false);
      }
      // console.log("book", booksData);
      // console.log("note", notesData);
    }
    if (searchInput.length !== 0) {
      console.log(searchInput);
      searchData();
    }
  }, [searchInput, isRender]);

  function searchTypeHandler(type) {
    // console.log("handler", searchInput);
    setIsData(true);
    setSearchBookResults([]);
    setSearchNoteResults([]);
    setSearchType(type);
  }

  return (
    <>
      <PageTitle>我的搜尋</PageTitle>
      <SearchContainer>
        <ButtonContainer>
          <Button
            active={searchType === "book"}
            onClick={() => searchTypeHandler("book")}
          >
            搜尋我的書櫃
          </Button>

          <Button
            active={searchType === "note"}
            onClick={() => searchTypeHandler("note")}
          >
            搜尋我的筆記內容
          </Button>
        </ButtonContainer>
        <SearchBar setSearchInput={setSearchInput} setIsRender={setIsRender} />

        {/* <SearchBar
          searchType={searchType}
          setSearchInput={setSearchInput}
          
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        /> */}
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
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
