import { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { DeleteBack2 } from "@styled-icons/remix-fill/DeleteBack2";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import firebase from "../utils/firebaseTools";
import tools from "../utils/tools";
import { UserProfile } from "../App";
import InputModal from "./modal/InputModal";
import uniqid from "uniqid";

const BoxWrapper = styled.div`
  display: flex;
  width: 80%;
  flex-wrap: wrap;
`;

const TagBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30%;
  max-width: 50%;
  min-height: 150px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
  background-color: #ffffff;
`;
const BoxDeleteTag = styled(DeleteBack2)`
  display: none;
  position: absolute;
  right: -5px;
  width: 22px;
  color: #ff6972;
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
const BoxName = styled.p`
  margin: 8px;
`;
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
  border: 1px solid #00d084;
  border-radius: 5px;
  ${Input}:checked + && {
    background-color: #00d084;
  }
`;

const AddSign = styled(AddCircle)`
  position: absolute;
  right: 5px;
  top: 110px;
  width: 30px;
  height: 30px;
  color: #00d084;
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
  color: #ff6972;

  ${TagContainer}:hover & {
    display: inline;
    z-index: 99;
  }
`;

let clickTagNameArray = [];
let allNotesData = [];
let selectedTagBoxName = "";

function TagBox(props) {
  const [showInputModal, setShowInputModal] = useState(false);
  const [isUpdateTagBoxName, setIsUpdateTagBoxName] = useState(false);
  const [notesBox, setNotesBoxData] = useState([]);
  // const tagBoxNameInputRef = useRef();
  const userId = useContext(UserProfile);

  useEffect(() => {
    allNotesData = [];
    clickTagNameArray = [];

    async function getData() {
      await firebase.getAllNotesData(userId).then((notes) => {
        notes.forEach((note) => {
          allNotesData.push(note.data());
        });
      });
    }
    getData();
  }, []);

  function showTagInputHandler(name) {
    selectedTagBoxName = name;
    console.log("show modal, group name", name);
    setShowInputModal(true);
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

    // console.log(allNotesData);
    allNotesData.forEach((note) => {
      if (tools.isNoteIncludeTag(clickTagNameArray, note)) {
        currentNoteData.push(note);
      }
    });
    setNotesBoxData(currentNoteData);
  }

  async function onBlurHandler(name, value) {
    let currentGroupData = [...props.groupData];
    currentGroupData.forEach((tagBox) => {
      if (name === tagBox.name) {
        tagBox.name = value;
      }
    });

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
      <BoxWrapper>
        {props.groupData?.map((box, index) => (
          <TagBoxContainer key={index}>
            <BoxDeleteTag
              onClick={() => deleteTagGroupHandler(index)}
              key={index}
            />
            <BoxNameDiv>
              {isUpdateTagBoxName ? (
                <Form
                  onSubmit={(e) => e.preventDefault()}
                  key={`${index}${box.name}`}
                >
                  <BoxNameInput
                    defaultValue={box.name}
                    as="input"
                    onBlur={(e) => onBlurHandler(box.name, e.target.value)}
                    key={box.name}
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
              <AddSign
                onClick={() => showTagInputHandler(box.name)}
                key={uniqid()}
              />
            </TagsContainer>
          </TagBoxContainer>
        ))}
      </BoxWrapper>

      {showInputModal && (
        <InputModal
          modalTitle={"標籤名稱"}
          setShowInputModal={setShowInputModal}
          groupData={props.groupData}
          setGroupData={props.setGroupData}
          selectedTagBoxName={selectedTagBoxName}
        />
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
