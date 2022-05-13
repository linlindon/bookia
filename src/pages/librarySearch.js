import styled from "styled-components";
import { useState, useEffect } from "react";
import Card from "../components/Card";
import SearchBar from "../components/Search";
import LoadingModal from "../components/modal/LoadingModal";
import tools from "../utils/tools";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3% 15%; ;
`;
const PageTitle = styled.h1`
  text-align: center;
  ${"" /* border-bottom: 2px red solid; */}
`;
const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 50px;

  @media only screen and (max-width: 786px) {
    font-size: 18px;
  }
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

function LibrarySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [noDataHint, setNoDataHint] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setIsLoading(true);
    tools.getGoogleBooks("靈感").then((data) => {
      let bookData = [];
      data.items.forEach((book) => {
        bookData.push(book.volumeInfo);
      });
      setBookList(bookData);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setBookList([]);
    console.log("last else");
    if (searchInput !== "") {
      setNoDataHint(false);
      setIsLoading(true);
      tools.getGoogleBooks(searchInput).then((data) => {
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
            top: 350,
            behavior: "smooth",
          });
        }
      });
    }
  }, [searchInput]);

  return (
    <>
      <PageTitle>圖書館</PageTitle>
      <Container>
        <Title>輸入欲搜尋的書名</Title>
        <SearchBar setSearchInput={setSearchInput} />
        {isLoading && <LoadingModal />}
        {noDataHint && <h2>搜尋不到此書</h2>}
        <DataContainer>
          <Card bookList={bookList} setIsLoading={setIsLoading} />
        </DataContainer>
      </Container>
    </>
  );
}

export default LibrarySearch;

{
  /* <LoadingContainer>
          <Loading />
        </LoadingContainer> */
}
