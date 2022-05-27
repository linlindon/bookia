import { useState, useEffect } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import SearchBar from "../components/Search";
import LoadingModal from "../components/modal/LoadingModal";
import tools from "../utils/tools";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  margin: 3% 15%;

  @media only screen and (max-width: 1280px) {
    margin: 2% 6%;
  }
  @media only screen and (max-width: 768px) {
    padding: 0 2%;
  }
`;
const PageTitle = styled.h1`
  text-align: center;
  @media only screen and (max-width: 768px) {
    font-size: 20px;
  }
`;
const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 50px;

  @media only screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

function LibrarySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [noDataHint, setNoDataHint] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  async function fetchData(input) {
    let bookData = [];
    await tools.getGoogleBooks(input).then((data) => {
      if (data.totalItems === 0) {
        return;
      }
      data.items.forEach((book) => {
        bookData.push(book.volumeInfo);
      });
    });
    return bookData;
  }

  useEffect(() => {
    setIsLoading(true);
    fetchData("創意").then((data) => {
      setBookList(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchInput !== "") {
      setBookList([]);
      setNoDataHint(false);
      setIsLoading(true);
      fetchData(searchInput).then((data) => {
        if (data.length === 0) {
          setIsLoading(false);
          setNoDataHint(true);
          return;
        }
        setBookList(data);
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
      <Wrapper>
        <Container>
          <Title>輸入欲搜尋的書名或ISBN號碼</Title>
          <SearchBar setSearchInput={setSearchInput} />
          {isLoading && <LoadingModal />}
          {noDataHint && <h2>搜尋不到此書</h2>}

          <Card bookList={bookList} setIsLoading={setIsLoading} />
        </Container>
      </Wrapper>
    </>
  );
}

export default LibrarySearch;
