import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { DeleteBack2 } from "@styled-icons/remix-fill/DeleteBack2";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import firebase from "../utils/firebaseTools";
import tools from "../utils/tools";
import { UserProfile } from "../App";
import InputModal from "./modal/InputModal";
import Note from "./Note";
import Loading from "../components/Loading";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;
const LoadingContainer = styled.div`
  position: absolute;
  margin-top: 40px;
`;
const BoxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  width: 80%;
  padding: 20px;
  margin-bottom: 30px;
  border-bottom: 2px solid #3fccdc;
  border-radius: 5px;
  ${"" /* background-color: #3fccdc; */}

  @media only screen and (min-width: 1280px) {
    width: 1180px;
  }
  @media only screen and (max-width: 786px) {
    align-items: center;
    flex-direction: column;
    width: 90%;
    padding: 5px;
  }
`;

const TagBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 30%;
  max-width: 50%;
  min-height: 150px;
  margin: 1%;
  padding: 10px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
  background-color: #ffffff;

  @media only screen and (max-width: 786px) {
    max-width: none;
    width: 90%;
    min-height: 120px;
  }
  @media only screen and (min-width: 1200px) {
    max-width: none;
    width: 31.2%;
  }
`;
const BoxDeleteTag = styled(DeleteBack2)`
  display: none;
  position: absolute;
  right: -5px;
  width: 22px;
  cursor: pointer;
  color: #ff6972;
  transform: rotate(0.92turn);

  ${TagBoxContainer}:hover & {
    display: inline;
    z-index: 99;
  }
`;
const BoxNameDiv = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 80%;
  margin-bottom: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #ece6e6;
`;
const BoxName = styled.p`
  margin: 8px;
`;
const BoxNameInput = styled.input`
  border: none;
  margin-top: 8px;
  margin-bottom: 12px;
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
  cursor: pointer;
  ${Input}:checked + && {
    background-color: #00d084;
  }
`;
const Form = styled.form``;
const TagContainer = styled.label`
  display: flex;
  position: relative;
`;
const AddSign = styled(AddCircle)`
  position: absolute;
  right: 5px;
  top: 90px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #00d084;

  @media only screen and (max-width: 786px) {
    top: 90px;
  }
`;

const DeleteTag = styled(DeleteBack2)`
  display: none;
  position: absolute;
  top: -5px;
  right: -10px;
  width: 18px;
  margin-left: 6px;
  cursor: pointer;
  color: #ff6972;
  transform: rotate(0.92turn);

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
  const [notesBoxData, setNotesBoxData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    props.setGroupData(currentGroupData);

    await firebase.updateTagGroup(userId, currentGroupData);
    setIsUpdateTagBoxName(false);
  }

  async function deleteTagHandler(tag, index) {
    let currentGroupData = [...props.groupData];
    let changeTagArray = currentGroupData[index].tags.filter((name) => {
      return name !== tag;
    });
    currentGroupData[index].tags = [...changeTagArray];
    props.setGroupData(currentGroupData);
    await firebase.updateTagGroup(userId, currentGroupData);
    await tools.deleteNotesTag(userId, tag);
    await tools.deleteBooksTag(userId, tag);
  }

  async function deleteTagGroupHandler(index) {
    setIsLoading(true);
    let currentGroupData = [...props.groupData];
    let tagsArray = currentGroupData[index].tags;
    currentGroupData.splice(index, 1);
    props.setGroupData(currentGroupData);
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

    setIsLoading(false);
  }

  return (
    <>
      <Wrapper>
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
        <BoxWrapper>
          {props.groupData?.map((box, index) => (
            <TagBoxContainer key={index}>
              <BoxDeleteTag
                onClick={() => deleteTagGroupHandler(index)}
                title="刪除書籤櫃"
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
                  <TagContainer name={tag} key={tagIndex}>
                    <Input id={tag} key={`${tag}${tagIndex}`}></Input>
                    <Tag onClick={() => choseTagHandler(tag)} key={tag}>
                      {tag}
                    </Tag>
                    <DeleteTag
                      onClick={() => deleteTagHandler(tag, index)}
                      key={`delete${tag}`}
                    />
                  </TagContainer>
                ))}
                <AddSign
                  onClick={() => showTagInputHandler(box.name)}
                  title="新增標籤"
                  key={`add${box.name}${index}`}
                />
              </TagsContainer>
            </TagBoxContainer>
          ))}
        </BoxWrapper>
      </Wrapper>
      {showInputModal && (
        <InputModal
          modalTitle={"標籤名稱"}
          setShowInputModal={setShowInputModal}
          groupData={props.groupData}
          setGroupData={props.setGroupData}
          selectedTagBoxName={selectedTagBoxName}
        />
      )}
      {notesBoxData && <Note notesBoxData={notesBoxData} />}
    </>
  );
}

export default TagBox;
