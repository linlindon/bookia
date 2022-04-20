import { useEffect, useState } from "react";
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
const SearchIcon = styled(Search)`
  width: 6%;
  color: green;
`;

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");

  async function searchData() {
    console.log("hi");
    const key = "AIzaSyAFgX7hNUEGGTH7nWl-nbHL7fuDH9XIHco";
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&key=${key}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data.items))
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      <SearchContainer>
        <SearchForm>
          <SearchInput
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="請輸入關鍵字"
          />
          <SearchIcon onClick={searchData} />
        </SearchForm>
      </SearchContainer>
      <div className="card-container">
        <div className="book-img">
          <img src="" alt="" />
        </div>
        <div className="book-info">
          <button className="button">選擇此書筆記</button>
          <h3 className="book-title">書名</h3>
          <p>作者</p>
          <p>出版年份</p>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
