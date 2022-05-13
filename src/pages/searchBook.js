import styled from "styled-components";
import { useState } from "react";
import SearchBar from "../components/Search";
import LoadingModal from "../components/modal/LoadingModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5% 15%; ;
`;

const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 50px;

  @media only screen and (max-width: 786px) {
    font-size: 18px;
  }
`;

function SearchBook() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Container>
        <Title>輸入欲新增的書名</Title>
        <SearchBar setIsLoading={setIsLoading} />
      </Container>
      {isLoading && <LoadingModal />}
    </>
  );
}

export default SearchBook;

{
  /* <LoadingContainer>
          <Loading />
        </LoadingContainer> */
}
