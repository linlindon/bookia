import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { getAuth } from "firebase/auth";
import uniqid from "uniqid";

const TagBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 30px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
`;
const BoxNameDiv = styled.div`
  displayL flex;
  justify-content: center;
  text-align: center;
  width: 80%;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #ece6e6;
`;
const BoxName = styled.p``;
const BoxNameInput = styled.input`
  border: none;
  margin-top: 12px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  gap: 1em;
`;

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
  ${"" /* position: absolute; */}
  top: -600px;
  width: 150px;
  height: 100px;
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
const Form = styled.form``;

let clickTagNameArray = [];
let allNotesData = [];
let inputTagBoxName = "";

function TagBox(props) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [inputTagName, setInputTagName] = useState("");
  const [isUpdateTagBoxName, setIsUpdateTagBoxName] = useState(false);
  const [updateTagBoxName, setUpdateTagBoxName] = useState("");
  const [notesBox, setNotesBoxData] = useState([]);
  const tagBoxNameInputRef = useRef();
  const user = getAuth().currentUser;
  const userId = user.uid;

  useEffect(async () => {
    allNotesData = [];
    clickTagNameArray = [];
    await firebase.getAllNotesData(userId).then((datas) => {
      datas.forEach((note) => {
        allNotesData.push(note.data());
      });
    });
  }, []);

  function showTagInputHandler(name) {
    inputTagBoxName = name;
    setShowTagInput(true);
  }

  async function addTagHandler() {
    if (!inputTagName) {
      alert("請輸入標籤名稱");
    } else {
      let currentGroupData = [...props.groupData];
      currentGroupData.forEach((tagBox) => {
        // console.log(tagBox);
        if (tagBox.name === inputTagBoxName) {
          tagBox.tags.push(inputTagName);
        } else {
          console.log("no match box name");
        }
      });
      await firebase.updateTagGroup(userId, currentGroupData);

      setShowTagInput(false);
      props.setGroupData(currentGroupData);
    }
  }
  function closeInputTagHandler() {
    setShowTagInput(false);
  }

  async function choseTagHandler(tagName) {
    let currentNoteData = [];
    if (clickTagNameArray.includes(tagName)) {
      clickTagNameArray = clickTagNameArray.filter((item) => {
        return item !== tagName;
      });
    } else {
      clickTagNameArray.push(tagName);
    }
    // console.log(clickTagNameArray);
    const noteIncludeTag = (tagArray, data) => {
      if (tagArray.length === 0) {
        return false;
      } else {
        return tagArray.every((i) => {
          return data.tagNames.includes(i);
        });
      }
    };
    // console.log(allNotesData);
    allNotesData.forEach((note) => {
      if (noteIncludeTag(clickTagNameArray, note)) {
        currentNoteData.push(note);
      }
    });
    setNotesBoxData(currentNoteData);
  }

  function updateTagBoxNameHandler() {
    setIsUpdateTagBoxName(true);
  }
  // function closeUpdateTagBoxNameHandler(e) {
  //   console.log("active");
  //   if (tagBoxNameInputRef.current === e.target) {
  //     console.log("close");
  //     setIsUpdateTagBoxName(false);
  //   }
  // }
  function focusHandler() {
    console.log("focus");
  }
  function formSubmit(e) {
    e.preventDefault();
  }

  async function onBlurHandler(name, value) {
    console.log("onblur");
    console.log(name, value);
    let groupsData = [];
    await firebase.getTagGroupsData(userId).then((data) => {
      groupsData.push(...data.tagGroups);
      groupsData.forEach((group) => {
        if (name === group.name) {
          group.name = value;
        }
      });
      // console.log(groupsData);
    });
    await firebase.updateTagGroup(userId, groupsData);
    props.setGroupData(groupsData);
    setIsUpdateTagBoxName(false);
  }
  return (
    <>
      {props.groupData?.map((box, index) => (
        <TagBoxContainer
          // ref={tagBoxNameInputRef}
          // onClick={closeUpdateTagBoxNameHandler}
          key={index}
        >
          <BoxNameDiv>
            {isUpdateTagBoxName ? (
              <Form onSubmit={(e) => formSubmit(e)}>
                <BoxNameInput
                  defaultValue={box.name}
                  as="input"
                  onFocus={focusHandler}
                  onBlur={(e) => onBlurHandler(box.name, e.target.value)}
                ></BoxNameInput>
              </Form>
            ) : (
              <BoxName key={box.name} onClick={updateTagBoxNameHandler}>
                {box.name}
              </BoxName>
            )}
          </BoxNameDiv>
          <TagsContainer key={`${box.name}${index}`}>
            {box.tags?.map((tag, index) => (
              <label name={tag} key={index}>
                <Input id={tag} key={`${tag}${index}`}></Input>
                <Tag onClick={() => choseTagHandler(tag)} key={tag}>
                  {tag}
                </Tag>
              </label>
            ))}
          </TagsContainer>
          <AddSign onClick={() => showTagInputHandler(box.name)} key={uniqid()}>
            新增
          </AddSign>
        </TagBoxContainer>
      ))}
      {showTagInput && (
        <Wrapper>
          <AddTagBox>
            <TagInput
              onChange={(e) => setInputTagName(e.target.value)}
              placeholder="新增標籤"
            ></TagInput>
            <CloseTagInput onClick={closeInputTagHandler}>x</CloseTagInput>
            <AddTagButton onClick={addTagHandler}>新增</AddTagButton>
          </AddTagBox>
        </Wrapper>
      )}
      {notesBox?.map((note) => (
        <NoteBox key={uniqid()}>
          <BoxName key={uniqid()}>書名: {note.bookTitle}</BoxName>
          <BookName key={uniqid()}>{note.title}</BookName>
          <TagsContainer key={uniqid()}>
            {note.tagNames.map((tag) => (
              <Tag key={uniqid()}>
                {tag}
                <DeleteSign key={uniqid()}>x</DeleteSign>
              </Tag>
            ))}
            <p key={uniqid()}>{note.content}</p>
            <AddSign key={uniqid()}>修改</AddSign>
          </TagsContainer>
        </NoteBox>
      ))}
    </>
  );
}

export default TagBox;
