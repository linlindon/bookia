import { useState, useEffect } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
// import Loading from "./Loading";
import Card from "./Card";
import HintModal from "./modal/HintModal";
import tools from "../utils/tools";

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
  cursor: pointer;
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

function SearchBar(props) {
  const [searchInput, setSearchInput] = useState("");
  const [bookList, setBookList] = useState([]);
  const [noDataHint, setNoDataHint] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setHintTitle] = useState("");

  useEffect(() => {
    props.setIsLoading(true);
    tools.getGoogleBooks("靈感").then((data) => {
      let bookData = [];
      data.items.forEach((book) => {
        bookData.push(book.volumeInfo);
      });
      setBookList(bookData);
      props.setIsLoading(false);
    });
  }, []);

  function searchData(e) {
    e.preventDefault();
    setNoDataHint(false);
    if (props.setIsRender) {
      props.setIsRender((prevState) => !prevState);
    }
    if (!searchInput) {
      return;
    } else if (searchInput.replace(/\s*/g, "").length === 0) {
      setHintTitle("請輸入要搜尋的書名");
      setIsHint(true);
    } else if (props.searchType) {
      console.log("have search type");
      props.setIsLoading(true);
      props.setSearchInput(searchInput);
    } else {
      setBookList([]);
      console.log("last else");
      props.setIsLoading(true);
      tools.getGoogleBooks(searchInput).then((data) => {
        let bookData = [];
        if (data.totalItems === 0) {
          props.setIsLoading(false);
          setNoDataHint(true);
          return;
        } else {
          data.items.forEach((book) => {
            bookData.push(book.volumeInfo);
          });
          setBookList(bookData);
          props.setIsLoading(false);
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
      {/* {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )} */}
      {noDataHint && <h2>搜尋不到此書</h2>}
      {isHint && <HintModal hintTitle={hintTitle} setIsHint={setIsHint} />}
      <DataContainer>
        <Card bookList={bookList} setIsLoading={props.setIsLoading} />
      </DataContainer>
    </>
  );
}

export default SearchBar;
