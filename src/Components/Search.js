import { useEffect, useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/bootstrap/Search";
import Card from "./Card";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

async function getSearchData(input) {
  const key = "AIzaSyAFgX7hNUEGGTH7nWl-nbHL7fuDH9XIHco";
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${key}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
}

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [bookList, setBookList] = useState([]);

  function searchData(input) {
    console.log(input);
    getSearchData(input).then((data) => {
      let bookData = [];
      data.items.forEach((book) => {
        bookData.push(book.volumeInfo);
      });
      setBookList(bookData);
    });
  }

  return (
    <>
      <SearchContainer>
        <SearchForm>
          <SearchInput
            onChange={(e) => searchData(e.target.value)}
            placeholder="請輸入關鍵字"
          />
          <SearchIcon onClick={searchData} />
        </SearchForm>
      </SearchContainer>
      <Card bookList={bookList} />
    </>
  );
}

export default SearchBar;
