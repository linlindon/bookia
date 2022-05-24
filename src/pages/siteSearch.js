import { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import firebase from "../utils/firebaseTools";
import SearchBar from "../components/Search";
import Book from "../components/Book";
import Note from "../components/Note";
import Loading from "../components/Loading";
import { UserProfile } from "../App";

const PageTitle = styled.h1`
  marign-top: 5%;
  text-align: center;
  @media only screen and (max-width: 768px) {
    margin-top: 20px;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3% 15%;

  @media only screen and (max-width: 1280px) {
    margin: 2% 6%;
  }
  @media only screen and (max-width: 768px) {
    padding: 0 2%;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  padding: 0 20px 35px;

  @media only screen and (max-width: 768px) {
    padding: 0 0 30px;
  }
  @media only screen and (max-width: 426px) {
    flex-direction: column;
    align-items: center;
  }
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

  @media only screen and (max-width: 768px) {
    margin: 10px;
  }
  @media only screen and (max-width: 426px) {
    font-size: 14px;
    width: 90%;
  }
`;
const BooksContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1280px;
  width: 100%;
`;

const Title = styled.h3`
  font-size: 16px;
`;
const LoadingContainer = styled.div`
  margin-top: 50px;
`;

function SiteSearch() {
  const [searchType, setSearchType] = useState("book");
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [searchNoteResults, setSearchNoteResults] = useState([]);
  const [noDataHint, setNoDataHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  const searchHintRef = useRef("請輸入關鍵字");
  let booksDataRef = useRef([]);
  let notesDataRef = useRef([]);

  useEffect(() => {
    if (userId) {
      firebase.getBooksData(userId).then((data) => {
        data.forEach((book) => {
          booksDataRef.current.push(book.data());
        });
      });
      firebase.getAllNotesData(userId).then((data) => {
        data.forEach((note) => {
          notesDataRef.current.push(note.data());
        });
      });
    }
  }, [userId]);

  function searchData(inputValue) {
    setSearchBookResults([]);
    setSearchNoteResults([]);
    setNoDataHint(false);
    setIsLoading(true);
    let inputWordArray = inputValue.split(" ");
    let filterData = [];
    if (searchType === "book") {
      inputWordArray.forEach((word) => {
        filterData = booksDataRef.current.filter((book) => {
          return book.title.toLowerCase().includes(word.toLowerCase());
        });
      });
      setIsLoading(false);
      setSearchBookResults(filterData);
      setNoDataHint(filterData.length === 0);
      return;
    }
    if (searchType === "note") {
      filterData = notesDataRef.current.filter((note) => {
        return inputWordArray.every((word) => {
          return note.content.toLowerCase().includes(word.toLowerCase());
        });
      });
      setIsLoading(false);
      setSearchNoteResults(filterData);
      setNoDataHint(filterData.length === 0);
    }
  }

  function searchTypeHandler(type) {
    setNoDataHint(false);
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
        <SearchBar searchData={searchData} ref={searchHintRef} />
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
        {noDataHint && <Title>無相關資料</Title>}
        {searchBookResults.length !== 0 && (
          <BooksContainer>
            <Book bookDatas={searchBookResults} />
          </BooksContainer>
        )}
        {searchNoteResults.length !== 0 && (
          <Note notesBoxData={searchNoteResults} />
        )}
      </SearchContainer>
    </>
  );
}

export default SiteSearch;
