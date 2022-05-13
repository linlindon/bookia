import { useState, useEffect } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
// import Loading from "./Loading";

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
  cursor: pointer;
`;

function SearchBar(props) {
  const [isHint, setIsHint] = useState(false);
  const [input, setInput] = useState("");
  const [hintTitle, setHintTitle] = useState("");

  function searchData(e) {
    e.preventDefault();
    console.log(input);

    // if (props.setIsRender) {
    //   props.setIsRender((prevState) => !prevState);
    // }
    if (input.replace(/\s*/g, "").length === 0) {
      setHintTitle("請輸入要搜尋的書名");
      setIsHint(true);
    } else {
      props.setSearchInput(input);
    }

    // else if (props.searchType) {
    //   console.log("have search type");
    //   props.setIsLoading(true);
    //   props.setSearchInput(searchInput);
    // }
  }

  return (
    <>
      <SearchContainer>
        <SearchForm onSubmit={(e) => searchData(e)}>
          <SearchInput
            onChange={(e) => setInput(e.target.value)}
            placeholder="請輸入關鍵字"
          />
          <SearchIcon onClick={searchData} />
        </SearchForm>
      </SearchContainer>

      {isHint && <HintModal hintTitle={hintTitle} setIsHint={setIsHint} />}
    </>
  );
}

export default SearchBar;
