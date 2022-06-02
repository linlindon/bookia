import { useState, forwardRef, useRef } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
import PropTypes from "prop-types";

import HintModal from "./modal/HintModal";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1280px;
  margin-bottom: 50px;
  width: 60%;

  @media only screen and (max-width: 1280px) {
    width: 80%;
  }
`;

const SearchForm = styled.form`
  display: flex;
  border-bottom: solid 1px black;
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

const SearchBar = forwardRef((props, ref) => {
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setHintTitle] = useState("");
  let inputValueRef = useRef("");

  function getInputData() {
    if (inputValueRef.current.replace(/\s*/g, "").length === 0) {
      setHintTitle("請輸入要搜尋的關鍵字");
      setIsHint(true);
      return;
    }
    if (props.setSearchInput) {
      props.setSearchInput(inputValueRef.current);
      return;
    }
    props.searchData(inputValueRef.current.toLowerCase());
  }

  return (
    <>
      <SearchContainer>
        <SearchForm
          onSubmit={(e) => {
            e.preventDefault();
            getInputData();
          }}
        >
          <SearchInput
            onChange={(e) => (inputValueRef.current = e.target.value)}
            placeholder={ref ? ref.current : "請輸入書名或ISBN"}
          />
          <SearchIcon onClick={getInputData} />
        </SearchForm>
      </SearchContainer>

      {isHint && <HintModal hintTitle={hintTitle} setIsHint={setIsHint} />}
    </>
  );
});

SearchBar.propTypes = {
  setSearchInput: PropTypes.func,
  refProp: PropTypes.shape({ current: PropTypes.string }),
};

export default SearchBar;
