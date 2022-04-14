import React from "react";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { tagsRef, tagGroupsRef } from "../utils/fireBaseConfig";

const TagBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 30px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
`;

const BoxName = styled.h4`
  width: 80%;
  padding-bottom: 10px;
  text-align: center;
  font-size: 16px;
  border-bottom: 2px solid #ece6e6;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  gap: 1em;
`;

const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;
// const DeleteSign = styled.span``;
const AddSign = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px black;
  line-height: 2.5;
`;

const Wrapper = styled.div`
  position: relative;
`;
const InputBox = styled.div`
  position: absolute;
  top: -150px;
  width: 50%;
  height: 200px;
  border: solid black 1px;
  border-radius: 10px;
  background-color: #ffffff;
  z-index: 9;
`;

function TagBox(props) {
  const [showInputBox, setShowInputBox] = React.useState(false);
  const [inputTagName, setInputTagName] = React.useState("");
  console.log(props.data);
  function showTagHandler() {
    setShowInputBox(true);
  }

  function inputBoxTagHandler(e) {
    setInputTagName(e);
  }
  function addTagHandler() {}
  return (
    <>
      {props.data.map((box) => (
        <TagBoxContainer>
          <BoxName>{box.title}</BoxName>
          <TagsContainer>
            {box.tags &&
              box.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
          </TagsContainer>
          <AddSign onClick={showTagHandler}>新增</AddSign>
        </TagBoxContainer>
      ))}
      {showInputBox ? (
        <Wrapper>
          <InputBox>
            <h3>請輸入要新增的書籤</h3>
            <input
              onChange={(e) => inputBoxTagHandler(e.target.value)}
              type="text"
            />
            <button onClick={addTagHandler}>新增書籤</button>
          </InputBox>
        </Wrapper>
      ) : (
        ""
      )}
    </>
  );
}

export default TagBox;
