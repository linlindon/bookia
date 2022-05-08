import { useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
import Loading from "./Loading";
import Card from "./Card";
import HintModal from "./modal/HintModal";

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

  margin-bottom: 50px;
  border-bottom: solid 1px black;
  @media only screen and (min-width: 1280px) {
    ${"" /* width: 1130px; */}
  }
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
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;
const DataContainer = styled.div`
  ${
    "" /* width: 100%;
  height: 100%; */
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

async function getSearchData(input) {
  const key = "AIzaSyAFgX7hNUEGGTH7nWl-nbHL7fuDH9XIHco";
  const type = "orderBy=newest";
  const type2 = "maxResults=40";
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${input}&key=${key}&${type2}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });
}

function SearchBar(props) {
  const [searchInput, setSearchInput] = useState("");
  const [bookList, setBookList] = useState([]);
  const [noDataHint, setNoDataHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setIsHintTitle] = useState("");

  function searchData(e) {
    e.preventDefault();
    setNoDataHint(false);
    if (props.setIsRender) {
      props.setIsRender((prevState) => !prevState);
    }
    if (!searchInput) {
      return;
    } else if (searchInput.replace(/\s*/g, "").length === 0) {
      setIsHintTitle("請輸入要搜尋的書名");
      setIsHint(true);
    } else if (props.searchType) {
      console.log("have search type");
      props.setIsLoading(true);
      props.setSearchInput(searchInput);
    } else {
      setBookList([]);
      console.log("last else");
      setIsLoading(true);
      getSearchData(searchInput).then((data) => {
        let bookData = [];

        if (data.totalItems === 0) {
          setIsLoading(false);
          setNoDataHint(true);
          return;
        } else {
          data.items.forEach((book) => {
            bookData.push(book.volumeInfo);
          });
          setBookList(bookData);
          setIsLoading(false);
          window.scrollTo({
            top: 300,
            behavior: "smooth",
          });
        }
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
      {noDataHint && <h2>搜尋不到此書</h2>}
      {isHint && <HintModal hintTitle={hintTitle} setIsHint={setIsHint} />}
      <DataContainer>
        <Card bookList={bookList} />
      </DataContainer>
    </>
  );
}

export default SearchBar;
