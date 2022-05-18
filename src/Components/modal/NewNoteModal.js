import { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";
import ContentEditor from "../Editor";
import firebase from "../../utils/firebaseTools";
import { UserProfile } from "../../App";
import InputModal from "./InputModal";
import Loading from "../Loading";
import HintModal from "./HintModal";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;
const TagBoxFlat = styled.div`
  position: relative;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  padding: 20px 40px;
  width: 60%;
  height: 600px;
  margin-bottom: 20px;
  background-color: white;
`;

const Title = styled.h3`
  margin: 18px 0 5px 0;
`;
const TitleInput = styled.input`
  width: 99%;
  height: 25px;
  padding: 3px;
  border-radius: 5px;
  border: 2px solid #d3d2d1;
`;

const CloseButton = styled(CloseSquareOutline)`
  position: absolute;
  top: 5px;
  right: 10px;
  width: 25px;
  color: #d3d2d1;
  cursor: pointer;

  &:hover {
    color: #ff6972;
  }
`;
const TagContentBox = styled(Flex)`
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 15px;
  border-radius: 5px;
  border: 2px solid #d3d2d1;
  margin-bottom: 20px;
`;
const TagsContainer = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
`;
const SubTitle = styled.h3`
  margin: 0;
  padding: 5px 0 15px 0;
  font-size: 16px;
`;

const Input = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;
const Tag = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 15px;
  background-color: #eeeded;
  cursor: pointer;
  ${Input}:checked + && {
    background-color: #e4d36d;
    color: #fff;
  }
`;
const ContentInput = styled.textarea`
  width: 98%;
  height: 25vh;
  border: 2px solid #d3d2d1;
`;

const AddSignContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 31px;
  height: 31px;
  border-radius: 16px;
  background-color: white;

  &:hover {
    box-shadow: 3px 3px 3px rgba(0 0 0 / 30%);
  }
`;
const AddSign = styled(AddCircle)`
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #dca246;
`;

const SubmitButton = styled.button`
  border: none;
  width: 120px;
  height: 35px;
  margin-top: 10px;
  margin-right: 20px;
  padding: 3px 8px;
  letter-spacing: 2px;
  text-align: center;
  font-size: 14px;
  border-radius: 5px;
  background-color: #e6c88b;
  color: #fff;

  &:hover {
    background-color: #dca246;
  }
`;

const LoadingContainer = styled.div`
  height: 50px;
  margin-top: 10px;
`;

let chosenTagArray = [];
let currentGroups = [];
let groupArray = [];
let selectedTagBox;

const NewNoteModal = (props) => {
  const [showInputModal, setShowInputModal] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setIsHintTitle] = useState("");
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const inputRef = useRef();
  const userId = useContext(UserProfile);
  const [inputDatas, setInputDatas] = useState({
    content: "",
    page: "",
    title: "",
  });
  const parse = require("html-react-parser");

  useEffect(() => {
    chosenTagArray = [];
    currentGroups = [...props.groupData];
    for (let i = 0; i < currentGroups.length; i++) {
      groupArray.push(false);
    }
    if (props.noteData) {
      console.log(props.noteData);
      setTitleInput(props.noteData.title);
      setNoteInput(props.noteData.content);
      setPageInput(props.noteData.page);
      chosenTagArray = [...props.noteData.tagNames];
      setInputDatas((prevState) => ({
        ...prevState,
        content: props.noteData.content,
        page: props.noteData.page,
        title: props.noteData.title,
      }));
    }
  }, []);

  function choseTagHandler(tag) {
    if (chosenTagArray.includes(tag)) {
      console.log("tag to delete===>", tag);
      chosenTagArray = chosenTagArray.filter((item) => {
        return item !== tag;
      });
    } else {
      chosenTagArray.push(tag);
    }
    console.log(chosenTagArray);
  }

  async function submitHandler(e) {
    e.preventDefault();
    setIsConfirmClose(false);
    setIsLoading(false);
    if (chosenTagArray.length === 0) {
      setIsHintTitle("每個筆記需要至少一個標籤");
      setIsHint(true);
    } else if (!titleInput) {
      setIsHintTitle("請輸入筆記標題");
      setIsHint(true);
    } else if (!noteInput) {
      setIsHintTitle("請輸入筆記內容");
      setIsHint(true);
    } else {
      setIsLoading(true);
      // console.log(props.noteData.id);
      // bug: inputData和state的inputDatas能否合在一起?
      let inputData = {
        bookID: props.bookInfo.id,
        id: props.noteData?.id ? props.noteData.id : "",
        bookTitle: props.bookInfo.title,
        tagNames: chosenTagArray,
        content: noteInput,
        page: inputDatas.page,
        title: inputDatas.title,
      };
      console.log(inputData.content);
      console.log("新筆記資料包===>", inputData);

      if (!props.noteData) {
        await firebase.addNewNote(userId, inputData);
      } else {
        await firebase.addNewNote(userId, inputData, props.noteData.id);
      }

      // // 把標籤加到書本
      let bookTagArray = [];
      await firebase.getBookInfo(userId, props.bookInfo.id).then((data) => {
        bookTagArray = data.tagNames;

        if (bookTagArray.length === 0) {
          bookTagArray = [...chosenTagArray];
        } else {
          chosenTagArray.forEach((tag) => {
            if (!bookTagArray.includes(tag)) {
              bookTagArray.push(tag);
            }
          });
        }
      });

      await firebase.updateBookTags(userId, props.bookInfo.id, bookTagArray);
      props.setShowNoteInput(false);
      chosenTagArray = [];
    }
  }

  function closeInputByWindow(e) {
    if (inputRef.current === e.target) {
      setIsConfirmClose(true);
      setIsHintTitle("變更未儲存，確定要離開嗎");
      setIsHint(true);
    }
  }
  function closeInput() {
    setIsConfirmClose(true);
    setIsHintTitle("變更未儲存，確定要離開嗎");
    setIsHint(true);
  }

  function tagInputHandler(index) {
    setShowInputModal(true);
    selectedTagBox = index;
  }

  return (
    <>
      <Background ref={inputRef} onClick={closeInputByWindow}>
        <TagBoxFlat onSubmit={submitHandler} as="form">
          <CloseButton onClick={closeInput}>X</CloseButton>

          <Title>筆記標題</Title>
          <TitleInput
            name="title"
            defaultValue={props.noteData && props.noteData.title}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder={"ex.書摘"}
          ></TitleInput>

          <Title>頁數</Title>
          <TitleInput
            name="page"
            defaultValue={props.noteData && props.noteData.page}
            onChange={(e) => setPageInput(e.target.value)}
          ></TitleInput>

          <Title>選擇此筆記的書籤</Title>
          {props.groupData?.map((data, index) => (
            <TagContentBox key={data.name}>
              <SubTitle>{data.name}</SubTitle>

              <TagsContainer>
                {data.tags.map((tag) => (
                  <label name={tag} key={tag}>
                    <Input
                      id={tag}
                      defaultChecked={
                        props.noteData
                          ? props.noteData.tagNames.includes(tag)
                          : false
                      }
                    ></Input>
                    <Tag onClick={() => choseTagHandler(tag)}>{tag}</Tag>
                  </label>
                ))}

                <AddSignContainer>
                  <AddSign
                    onClick={() => tagInputHandler(index)}
                    title="新增標籤"
                  />
                </AddSignContainer>
              </TagsContainer>
            </TagContentBox>
          ))}

          <div>
            <Title>筆記內容</Title>
            <ContentEditor
              noteData={props.noteData}
              setNoteInput={setNoteInput}
              inputDatas={inputDatas}
            />

            {/* <ContentInput
              defaultValue={props.noteData ? props.noteData.content : ""}
              name="content"
              onChange={inputChangeHandler}
            /> */}
          </div>
          {isLoading ? (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          ) : (
            <SubmitButton>{props.noteData ? "修改" : "新增"}</SubmitButton>
          )}
        </TagBoxFlat>
        {showInputModal && (
          <InputModal
            groupData={currentGroups}
            setGroupData={props.setGroupData}
            setShowInputModal={setShowInputModal}
            modalTitle={"標籤名稱"}
            selectedBoxIndex={selectedTagBox}
          />
        )}
        {isHint && (
          <HintModal
            hintTitle={hintTitle}
            setIsHint={setIsHint}
            setShowNoteInput={props.setShowNoteInput}
            isConfirmClose={isConfirmClose}
          />
        )}
      </Background>
    </>
  );
};

export default NewNoteModal;
