import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { Search } from "@styled-icons/bootstrap/Search";
import { UserProfile } from "../App";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RadioContainer = styled.div`
  display: flex;
  padding: 20px;
  margin: 10px;
`;
const Radio = styled.input.attrs({ type: "radio" })`
  ${"" /* display: none; */}
`;
const Button = styled.label`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
  ${Radio}:checked + && {
    background-color: #ffb226;
  }
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
const SearchIcon = styled(Search)`
  width: 6%;
  color: green;
`;

let bookTitleArray = [];
function SiteSearch() {
  const [searchType, setSearchType] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const userId = useContext(UserProfile);
  useEffect(() => {
    bookTitleArray = [];
    firebase.getBooksData(userId).then((data) => {
      data.forEach((book) => {
        bookTitleArray.push(book.data().title);
      });
      console.log(bookTitleArray);
    });
  }, []);

  function searchData(e) {
    e.preventDefault();
    let x;
    if (!searchType) {
      alert("請先選擇要搜尋的項目");
    } else if (!searchInput) {
      return;
    } else {
      x = bookTitleArray.filter((title) => {
        title.match(/^金/g);
      });
    }
  }
  function searchTypeHandler(e) {
    console.log(e);
  }

  return (
    <>
      <SearchContainer>
        <RadioContainer>
          <div>
            <Radio id="book" name="radio"></Radio>
            <Button onClick={(e) => searchTypeHandler(e.target.value)}>
              搜尋站內書籍
            </Button>
          </div>

          <div>
            <Radio id="note" name="radio"></Radio>
            <Button onClick={(e) => setSearchType(e.target.value)}>
              搜尋筆記
            </Button>
          </div>
        </RadioContainer>
        <SearchForm onSubmit={(e) => searchData(e)}>
          <SearchInput
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="請輸入關鍵字"
          />
          <SearchIcon onClick={searchData} />
        </SearchForm>
      </SearchContainer>
      {/* <Card bookList={bookList} /> */}
    </>
  );
}

export default SiteSearch;