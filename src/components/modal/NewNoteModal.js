import { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";
import ContentEditor from "../Editor";

import firebase from "../../utils/firebaseTools";
import InputModal from "./InputModal";
import HintModal from "./HintModal";
import Loading from "../Loading";
import { UserProfile } from "../../App";

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
  max-width: 1000px;
  height: 600px;
  background-color: white;

  @media only screen and (max-width: 768px) {
    width: 70%;
  }
  @media only screen and (max-width: 426px) {
    width: 80%;
    padding: 10px 25px;
    text-align: center;
  }
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

  @media only screen and (max-width: 426px) {
    align-items: center;
  }
`;

const TagsContainer = styled(Flex)`
  flex-wrap: wrap;
  gap: 1em;

  @media only screen and (max-width: 768px) {
    margin-right: 20px;
  }
  @media only screen and (max-width: 426px) {
    margin-right: 0px;
    margin-bottom: 20px;
    align-items: center;
  }
`;
const SubTitle = styled.h3`
  margin: 0;
  padding: 5px 0 15px 0;
  font-size: 16px;

  @media only screen and (max-width: 426px) {
    padding: 0px 0 1px 0;
    margin-bottom: 15px;
    border-bottom: solid 2px #d3d2d1;
  }
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
  @media only screen and (max-width: 426px) {
    right: 16px;
    bottom: 2px;
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
  margin: 20px 0px;
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

const NewNoteModal = (props) => {
  const [showInputModal, setShowInputModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setIsHintTitle] = useState("");
  const [isConfirmClose, setIsConfirmClose] = useState(false);
  const [inputDatas, setInputDatas] = useState({
    content: props.noteData && props.noteData.content,
    page: props.noteData ? props.noteData.page : "",
    title: props.noteData && props.noteData.title,
  });
  const backgroundRef = useRef();
  let chosenTagRef = useRef([]);
  let selectedTagBox = useRef();
  const userId = useContext(UserProfile);

  useEffect(() => {
    chosenTagRef.current = [];

    if (props.noteData) {
      chosenTagRef.current = [...props.noteData.tagNames];
    }
  }, [props.noteData]);

  function choseTagHandler(tag) {
    if (chosenTagRef.current.includes(tag)) {
      chosenTagRef.current = chosenTagRef.current.filter((item) => {
        return item !== tag;
      });
    } else {
      chosenTagRef.current.push(tag);
    }
  }

  async function submitHandler() {
    setIsConfirmClose(false);
    setIsLoading(false);
    if (chosenTagRef.current.length === 0) {
      setIsHintTitle("每個筆記需要至少一個標籤");
      setIsHint(true);
      return;
    }
    if (!inputDatas.title) {
      setIsHintTitle("請輸入筆記標題");
      setIsHint(true);
      return;
    }
    if (!inputDatas.content) {
      setIsHintTitle("請輸入筆記內容");
      setIsHint(true);
      return;
    }
    setIsLoading(true);

    let inputData = {
      bookID: props.bookInfo.id,
      id: props.noteData?.id ? props.noteData.id : "",
      bookTitle: props.bookInfo.title,
      tagNames: chosenTagRef.current,
      content: inputDatas.content,
      page: inputDatas.page,
      title: inputDatas.title,
    };

    if (!props.noteData) {
      await firebase.addNewNote(userId, inputData);
    } else {
      await firebase.addNewNote(userId, inputData, props.noteData.id);
    }

    let bookTagArray = [];
    await firebase.getBookInfo(userId, props.bookInfo.id).then((data) => {
      bookTagArray = data.tagNames;

      if (bookTagArray.length === 0) {
        bookTagArray = [...chosenTagRef.current];
      } else {
        chosenTagRef.current.forEach((tag) => {
          if (!bookTagArray.includes(tag)) {
            bookTagArray.push(tag);
          }
        });
      }
    });
    await firebase.updateBookTags(userId, props.bookInfo.id, bookTagArray);
    props.setShowNoteInput(false);
    chosenTagRef.current = [];
  }

  function closeInputByWindow(e) {
    if (backgroundRef.current === e.target) {
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
    selectedTagBox.current = index;
  }

  return (
    <Background ref={backgroundRef} onClick={closeInputByWindow}>
      <TagBoxFlat
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
        as="form"
      >
        <CloseButton onClick={closeInput}>X</CloseButton>

        <Title>筆記標題</Title>
        <TitleInput
          name="title"
          defaultValue={props.noteData && props.noteData.title}
          onChange={(e) =>
            setInputDatas((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder={"ex.書摘"}
        ></TitleInput>

        <Title>頁數</Title>
        <TitleInput
          name="page"
          defaultValue={props.noteData && props.noteData.page}
          onChange={(e) =>
            setInputDatas((prev) => ({
              ...prev,
              page: e.target.value,
            }))
          }
        ></TitleInput>

        <Title>選擇此筆記的書籤</Title>
        {props.groupData?.map((data, index) => (
          <TagContentBox key={data.name}>
            <SubTitle>{data.name}</SubTitle>
            <div>
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
              </TagsContainer>
              <AddSignContainer>
                <AddSign
                  onClick={() => tagInputHandler(index)}
                  title="新增標籤"
                />
              </AddSignContainer>
            </div>
          </TagContentBox>
        ))}

        <div>
          <Title>筆記內容</Title>
          <ContentEditor
            noteData={props.noteData}
            setInputDatas={setInputDatas}
            inputDatas={inputDatas}
          />
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
          groupData={props.groupData}
          setGroupData={props.setGroupData}
          setShowInputModal={setShowInputModal}
          modalTitle={"標籤名稱"}
          selectedBoxIndex={selectedTagBox.current}
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
  );
};

NewNoteModal.propTypes = {
  showNoteInput: PropTypes.bool,
  setShowNoteInput: PropTypes.func,
  bookInfo: PropTypes.object,
  noteData: PropTypes.object,
  groupData: PropTypes.array,
  setGroupData: PropTypes.func,
};

export default NewNoteModal;
