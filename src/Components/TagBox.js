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
  setDoc,
} from "firebase/firestore";
import { tagsRef, notesRef, tagGroupsRef } from "../utils/fireBaseConfig";

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

const AddTagBox = styled.div`
  position: absolute;
  top: -600px;
  width: 150px;
  height: 60px;
  border: solid black 1px;
  border-radius: 10px;
  background-color: #ffffff;
  z-index: 9;
`;

const TagInput = styled.input`
  margin: 5%;
`;

const AddTagButton = styled.button`
  margin-left: 70%;
`;
const CloseTagInput = styled.span`
  font-size: 16px;
`;

function TagBox(props) {
  const [showTagInput, setShowTagInput] = React.useState(false);
  const [inputTagName, setInputTagName] = React.useState("");
  const [tagBoxId, getTagBoxId] = React.useState("");

  function showTagHandler(boxId) {
    getTagBoxId(boxId);
    setShowTagInput(true);
  }

  function inputTagHandler(e) {
    setInputTagName(e);
  }
  async function addTagHandler() {
    if (!inputTagName) {
      alert("請輸入標籤名稱");
    } else {
      const setTagsRef = doc(tagsRef);
      await setDoc(setTagsRef, {
        name: inputTagName,
        tagID: setTagsRef.id,
        tagGroupID: tagBoxId,
      });
      setShowTagInput(false);

      const newDatas = props.data.map((item, index) => {
        if (item.id === tagBoxId) {
          console.log(item.id);
          item.tags.push(inputTagName);
          console.log(item.tags);
        }
        return { ...item, tags: [...item.tags] };
      });
      props.setboxDatas(newDatas);
    }
  }
  function closeInputTagHandler() {
    setShowTagInput(false);
  }

  async function choseTagHandler(tagName) {
    console.log(tagName);
    const q = query(tagsRef, where("name", "==", tagName));
    const tagData = await getDocs(q);
    const clickTagIdArray = tagData.docs.map((item) => {
      return item.data().tagID;
    });

    await Promise.all(
      clickTagIdArray.map(async (i) => {
        console.log("map i", i);
        const tagNameQuery = query(
          notesRef,
          where("tags", "array-contains", i)
        );
        const notes = await getDocs(tagNameQuery);
        notes.forEach((item) => {});
      })
    );
  }

  return (
    <>
      {props.data.map((box) => (
        <TagBoxContainer key={box.id}>
          <BoxName>{box.title}</BoxName>
          <TagsContainer>
            {box.tags &&
              box.tags.map((tag, index) => (
                <Tag onClick={() => choseTagHandler(tag)} key={index}>
                  {tag}
                </Tag>
              ))}
          </TagsContainer>
          <AddSign onClick={() => showTagHandler(box.id)}>新增</AddSign>
        </TagBoxContainer>
      ))}
      {showTagInput ? (
        <Wrapper>
          <AddTagBox>
            <TagInput
              onChange={(e) => inputTagHandler(e.target.value)}
              placeholder="新增標籤"
            ></TagInput>
            <CloseTagInput onClick={closeInputTagHandler}>x</CloseTagInput>
            <AddTagButton onClick={addTagHandler}>新增</AddTagButton>
          </AddTagBox>
        </Wrapper>
      ) : (
        ""
      )}
    </>
  );
}

export default TagBox;
