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
import { tagsRef, notesRef } from "../utils/fireBaseConfig";

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
const Label = styled.label``;
const Input = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const Tag = styled.div`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
  ${Input}:checked + && {
    background-color: #ffb226;
  }
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
const NoteBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  border: 1px solid #ece6e6;
  border-radius: 10px;
  margin-top: 30px;
`;
const BookName = styled.div`
  display: block;
  margin-bottom: 5px;
`;
const DeleteSign = styled.span``;

let clickTagNameArray = [];
let allNotesData = [];
function TagBox(props) {
  const [showTagInput, setShowTagInput] = React.useState(false);
  const [inputTagName, setInputTagName] = React.useState("");
  const [tagBoxId, getTagBoxId] = React.useState("");
  const [notesBox, setNotesBoxData] = React.useState([]);
  const [changeTagStyle, setChagneTagStyle] = React.useState(false);

  React.useEffect(async () => {
    (await getDocs(notesRef)).forEach((note) => {
      allNotesData.push(note.data());
    });
    console.log(allNotesData);
  }, []);

  function showTagHandler(boxId) {
    console.log(boxId);
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

      const newDatas = props.data.map((item) => {
        if (item.id === tagBoxId) {
          item.tags.push(inputTagName);
        }
        return { ...item, tags: [...item.tags] };
      });
    }
  }
  function closeInputTagHandler() {
    setShowTagInput(false);
  }

  async function choseTagHandler(tagName) {
    console.log(tagName);
    let currentNoteData = [];
    if (clickTagNameArray.includes(tagName)) {
      clickTagNameArray = clickTagNameArray.filter((item) => {
        console.log("tagname to delete===>", tagName);
        return item !== tagName;
      });
    } else {
      console.log("tagname to add to array===>", tagName);
      clickTagNameArray.push(tagName);
    }

    console.log(clickTagNameArray);
    // console.log(allNotesData);

    const noteIncludeTag = (tagArray, data) => {
      if (tagArray.length === 0) {
        return false;
      } else {
        return tagArray.every((i) => {
          return data.tagNames.includes(i);
        });
      }
    };

    allNotesData.forEach((note) => {
      console.log(noteIncludeTag(clickTagNameArray, note));
      if (noteIncludeTag(clickTagNameArray, note)) {
        currentNoteData.push(note);
      }
    });
    setNotesBoxData(currentNoteData);
  }

  return (
    <>
      {props.groupData?.map((box) => (
        <TagBoxContainer key={box.id}>
          <BoxName>{box.name}</BoxName>
          <TagsContainer key={box.id}>
            {box.tags &&
              box.tags.map((tag, index) => (
                <Label name={tag}>
                  <Input id={tag}></Input>
                  <Tag onClick={() => choseTagHandler(tag)} key={index}>
                    {tag}
                  </Tag>
                </Label>
              ))}
          </TagsContainer>
          <AddSign onClick={() => showTagHandler(box.id)}>新增</AddSign>
        </TagBoxContainer>
      ))}
      {showTagInput && (
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
      )}
      {notesBox?.map((note) => (
        <NoteBox>
          <BoxName>書名: {note.bookTitle}</BoxName>
          <BookName>{note.title}</BookName>
          <TagsContainer>
            {note.tagNames.map((tag) => (
              <Tag>
                {tag}
                <DeleteSign>x</DeleteSign>
              </Tag>
            ))}
            <p>{note.content}</p>
            <AddSign>修改</AddSign>
          </TagsContainer>
        </NoteBox>
      ))}
    </>
  );
}

export default TagBox;
