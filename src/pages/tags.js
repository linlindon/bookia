import styled from "styled-components";
import React from "react";
import TagBox from "../components/TagBox";
import { tagGroupsRef } from "../utils/fireBaseConfig";
import { setDoc, doc, onSnapshot } from "firebase/firestore";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const Wrapper = styled.div`
  position: relative;
`;
const AddBoxSign = styled.div`
  width: 50px;
  height: 50px;
  font-size: 26px;
  border-radius: 25px;
  border: solid 1px black;
  line-height: 2;
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

function Tags() {
  const [showInputBox, setShowInputBox] = React.useState(false);
  const [inputBoxTitle, setInputBoxTitle] = React.useState("");

  function showBoxHandler() {
    setShowInputBox(true);
  }
  function inputBoxTitleHandler(e) {
    setInputBoxTitle(e);
  }

  async function addBoxHandler() {
    if (!inputBoxTitle) {
      alert("請輸入標籤櫃名稱");
    } else {
      const setTagGroupsRef = doc(tagGroupsRef);
      await setDoc(setTagGroupsRef, {
        title: inputBoxTitle,
        id: setTagGroupsRef.id,
      });
      setShowInputBox(false);
      onSnapshot(tagGroupsRef, { includeMetadataChanges: true }, () => {});
    }
    console.log(inputBoxTitle);
  }

  return (
    <>
      <Container>
        <h1>書籤櫃</h1>
        <TagBox />
      </Container>
      <AddBoxSign onClick={showBoxHandler}>+</AddBoxSign>
      {showInputBox ? (
        <Wrapper>
          <InputBox>
            <h3>請輸入要新增的書籤櫃名稱</h3>
            <input
              onChange={(e) => inputBoxTitleHandler(e.target.value)}
              type="text"
            />
            <button onClick={addBoxHandler}>新增標籤櫃</button>
          </InputBox>
        </Wrapper>
      ) : (
        ""
      )}
    </>
  );
}
export default Tags;
