import { useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
import Loading from "./Loading";
import Card from "./Card";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;

  @media only screen and (min-width: 1280px) {
    width: 1300px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  border-bottom: solid 1px black;
`;

const SearchInput = styled.input`
  font-size: 15px;
  border: none;
  width: 100%;
  background-color: #f2f1f0;

  &:focus {
    outline: none;
  }
`;
const SearchIcon = styled(Search)`
  width: 30px;
`;
const LoadingContainer = styled.div`
  margin-top: 100px;
`;
const DataContainer = styled.div`
  display: flex;
  justify-content: center;
`;

async function getSearchData(input) {
  const key = "AIzaSyAFgX7hNUEGGTH7nWl-nbHL7fuDH9XIHco";
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${key}&maxResults=40`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
}

function SearchBar(props) {
  const [searchInput, setSearchInput] = useState("");
  const [bookList, setBookList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log("search bar render");
  function searchData(e) {
    e.preventDefault();
    if (props.setIsRender) {
      props.setIsRender((prevState) => !prevState);
    }
    if (!searchInput) {
      return;
    } else if (searchInput.replace(/\s*/g, "").length === 0) {
      alert("請輸入要搜尋的文字");
    } else if (props.searchType) {
      console.log("have search type");
      props.setIsLoading(true);
      props.setSearchInput(searchInput);
    } else {
      console.log("last else");
      setIsLoading(true);
      getSearchData(searchInput).then((data) => {
        let bookData = [];
        data.items.forEach((book) => {
          bookData.push(book.volumeInfo);
        });
        setBookList(bookData);
        setIsLoading(false);
      });
    }
  }

  return (
    <>
      <SearchContainer>
        <SearchForm onSubmit={(e) => searchData(e)}>
          <SearchInput
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="請輸入關鍵字"
          />
          <SearchIcon onClick={(e) => searchData(e)} />
        </SearchForm>
      </SearchContainer>
      {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
      <DataContainer>
        <Card bookList={bookList} />
      </DataContainer>
    </>
  );
}

export default SearchBar;
