import { useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
import PropTypes from "prop-types";

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

  function searchData() {
    // if (props.setIsRender) {
    //   props.setIsRender((prevState) => !prevState);
    // }
    if (input.replace(/\s*/g, "").length === 0) {
      setHintTitle("請輸入要搜尋的書名");
      setIsHint(true);
      return;
    }
    props.setSearchInput(input.toLowerCase());
  }

  return (
    <>
      <SearchContainer>
        <SearchForm
          onSubmit={(e) => {
            e.preventDefault();
            searchData();
          }}
        >
          <SearchInput
            onChange={(e) => setInput(e.target.value)}
            placeholder="請輸入書名或ISBN"
          />
          <SearchIcon onClick={searchData} />
        </SearchForm>
      </SearchContainer>

      {isHint && <HintModal hintTitle={hintTitle} setIsHint={setIsHint} />}
    </>
  );
}

SearchBar.propTypes = {
  setSearchInput: PropTypes.func,
};

export default SearchBar;