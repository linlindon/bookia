import styled from "styled-components";
import { Search } from "@styled-icons/bootstrap/Search";

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
const SearchY = styled(Search)`
  width: 6%;
  color: green;
`;

function SearchBar() {
  return (
    <SearchContainer>
      <SearchForm>
        <SearchInput placeholder="請輸入關鍵字" />
        <SearchY />
      </SearchForm>
    </SearchContainer>
  );
}

export default SearchBar;
