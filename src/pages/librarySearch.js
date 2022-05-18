import { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import SearchBar from "../components/Search";
import LoadingModal from "../components/modal/LoadingModal";
import tools from "../utils/tools";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3% 15%;

  @media only screen and (max-width: 1100px) {
    margin: 1.5% 8%;
  }
`;
const PageTitle = styled.h1`
  text-align: center;
  @media only screen and (max-width: 786px) {
    font-size: 20px;
  }
`;
const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 50px;

  @media only screen and (max-width: 786px) {
    font-size: 16px;
  }
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

    if (searchInput !== "") {
      setNoDataHint(false);
      setIsLoading(true);
      tools.getGoogleBooks(searchInput).then((data) => {
        let bookData = [];
        if (data.totalItems === 0) {
          setIsLoading(false);
          setNoDataHint(true);
          return;
        }
        data.items.forEach((book) => {
          bookData.push(book.volumeInfo);
        });
        setBookList(bookData);
        setIsLoading(false);
        window.scrollTo({
          top: 350,
          behavior: "smooth",
        });
      });
    }
  }, [searchInput]);

  return (
    <>
      <PageTitle>圖書館</PageTitle>
      <Container>
        <Title>輸入欲搜尋的書名或ISBN號碼</Title>
        <SearchBar setSearchInput={setSearchInput} />
        {isLoading && <LoadingModal />}
        {noDataHint && <h2>搜尋不到此書</h2>}

        <Card bookList={bookList} setIsLoading={setIsLoading} />
      </Container>
    </>
  );
}

export default LibrarySearch;
