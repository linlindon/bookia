import SearchBar from "../components/Search";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function SearchBookTitle() {
  return (
    <Container>
      <h1>搜尋要新增筆記的書籍</h1>
      <SearchBar />
    </Container>
  );
}

export default SearchBookTitle;
