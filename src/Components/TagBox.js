import { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { DeleteBack2 } from "@styled-icons/remix-fill/DeleteBack2";
import firebase from "../utils/firebaseTools";
import tools from "../utils/tools";
import { UserProfile } from "../App";
import uniqid from "uniqid";

const TagBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 30px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
`;
const BoxDeleteTag = styled(DeleteBack2)`
  display: none;
  position: absolute;
  right: -5px;
  width: 22px;
  color: #dbad2c;
  transform: rotate(0.92turn);

  ${TagBoxContainer}:hover & {
    display: inline;
    z-index: 99;
  }
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
const TagContainer = styled.label`
  display: flex;
`;
const DeleteTag = styled(DeleteBack2)`
  display: none;
  width: 18px;
  margin-left: 6px;
  color: #dbad2c;

  ${TagContainer}:hover & {
    display: inline;
    z-index: 99;
  }
`;

let clickTagNameArray = [];
let allNotesData = [];
let inputTagBoxName = "";

function TagBox(props) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [inputTagName, setInputTagName] = useState("");
  const [isUpdateTagBoxName, setIsUpdateTagBoxName] = useState(false);
  const [notesBox, setNotesBoxData] = useState([]);
  // const tagBoxNameInputRef = useRef();
  const userId = useContext(UserProfile);

  useEffect(async () => {
    allNotesData = [];
    clickTagNameArray = [];
    await firebase.getAllNotesData(userId).then((notes) => {
      notes.forEach((note) => {
        allNotesData.push(note.data());
      });
    });
  }, []);

  function showTagInputHandler(name) {
    inputTagBoxName = name;
    setShowTagInput(true);
  }

  async function addTagHandler(e) {
    e.preventDefault();
    let currentGroupData = [...props.groupData];
    let allTags = tools.allTagsArray(currentGroupData);

    if (!inputTagName) {
      alert("請輸入標籤名稱");
    } else if (allTags.includes(inputTagName)) {
      alert("此標籤已存在");
    } else {
      currentGroupData.forEach((tagBox) => {
        console.log(tagBox);
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

  //
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

  async function onBlurHandler(name, value) {
    console.log("onblur", name, value);
    let currentGroupData = [...props.groupData];
    currentGroupData.forEach((tagBox) => {
      if (name === tagBox.name) {
        tagBox.name = value;
      }
    });
    // console.log(groupsData);
    await firebase.updateTagGroup(userId, currentGroupData);
    props.setGroupData(currentGroupData);
    setIsUpdateTagBoxName(false);
  }

  async function deleteTagHandler(tag, index) {
    let currentGroupData = [...props.groupData];
    let changeTagArray = currentGroupData[index].tags.filter((name) => {
      return name !== tag;
    });
    currentGroupData[index].tags = [...changeTagArray];
    await firebase.updateTagGroup(userId, currentGroupData);
    await tools.deleteNotesTag(userId, tag);
    await tools.deleteBooksTag(userId, tag);
    props.setGroupData(currentGroupData);
  }

  async function deleteTagGroupHandler(index) {
    let currentGroupData = [...props.groupData];
    let tagsArray = currentGroupData[index].tags;
    currentGroupData.splice(index, 1);
    // console.log(tagsArray);
    if (tagsArray !== 0) {
      // 要加上警語
      await Promise.all(
        tagsArray.map(async (tag) => {
          await tools.deleteNotesTag(userId, tag);
        })
      );
      await Promise.all(
        tagsArray.map(async (tag) => {
          await tools.deleteBooksTag(userId, tag);
        })
      );
    }
    await firebase.updateTagGroup(userId, currentGroupData);
    props.setGroupData(currentGroupData);
  }

  return (
    <>
      {props.groupData?.map((box, index) => (
        <TagBoxContainer
          // ref={tagBoxNameInputRef}
          // onClick={closeUpdateTagBoxNameHandler}
          key={index}
        >
          <BoxDeleteTag onClick={() => deleteTagGroupHandler(index)} />
          <BoxNameDiv>
            {isUpdateTagBoxName ? (
              <Form onSubmit={(e) => e.preventDefault()}>
                <BoxNameInput
                  defaultValue={box.name}
                  as="input"
                  onFocus={focusHandler}
                  onBlur={(e) => onBlurHandler(box.name, e.target.value)}
                />
              </Form>
            ) : (
              <BoxName
                key={box.name}
                onClick={() => setIsUpdateTagBoxName(true)}
              >
                {box.name}
              </BoxName>
            )}
          </BoxNameDiv>
          <TagsContainer key={`${box.name}${index}`}>
            {box.tags?.map((tag, tagIndex) => (
              <>
                <TagContainer name={tag} key={tagIndex}>
                  <Input id={tag} key={`${tag}${tagIndex}`}></Input>
                  <Tag onClick={() => choseTagHandler(tag)} key={tag}>
                    {tag}
                  </Tag>
                  <DeleteTag onClick={() => deleteTagHandler(tag, index)} />
                </TagContainer>
              </>
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
            <form onSubmit={(e) => addTagHandler(e)}>
              <TagInput
                onChange={(e) => setInputTagName(e.target.value)}
                placeholder="新增標籤"
              ></TagInput>
              <CloseTagInput onClick={closeInputTagHandler}>x</CloseTagInput>
              <AddTagButton>新增</AddTagButton>
            </form>
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
                <DeleteSign key={uniqid()} />
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
