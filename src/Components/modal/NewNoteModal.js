import { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";
import firebase from "../../utils/firebaseTools";
import tools from "../../utils/tools";
import { UserProfile } from "../../App";
import InputModal from "./InputModal";
import AddTagSign from "../AddTagSign";

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
  width: 20px;
  color: #ff6972;
  cursor: pointer;
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
  ${Input}:checked + && {
    background-color: #e4d36d;
    color: #fff;
  }
`;
const ContentInput = styled.textarea`
  width: 98.9%;
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
  letter-spacing: 2px;
  text-align: center;
  margin-top: 10px;
  padding: 3px 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #e6c88b;
  color: #fff;

  &:hover {
    background-color: #dca246;
  }
`;

let chosenTagArray = [];
let currentGroups = [];
let groupArray = [];
let selectedTagBox;
const NewNote = (props) => {
  const [groupData, setGroupData] = useState([]);
  const [inputDatas, setInputDatas] = useState({
    content: "",
    page: "",
    title: "",
  });
  const [showInputModal, setShowInputModal] = useState(false);
  const inputRef = useRef();
  const userId = useContext(UserProfile);

  useEffect(() => {
    chosenTagArray = [];
    let data = [];
    firebase.getTagGroupsData(userId).then((res) => {
      data.push(...res.tagGroups);
      setGroupData(data);
      currentGroups = [...data];
      for (let i = 0; i < data.length; i++) {
        groupArray.push(false);
      }
    });

    if (props.noteData) {
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

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputDatas((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function submitHandler(e) {
    e.preventDefault();

    if (chosenTagArray.length === 0) {
      alert("每個筆記需要至少一個標籤");
    } else if (!inputDatas.title) {
      alert("請輸入筆記標題");
    } else if (!inputDatas.content) {
      alert("請輸入筆記內容");
    } else {
      let inputData = {
        ...inputDatas,
        bookID: props.bookInfo.id,
        id: props.noteData && props.bookInfo.noteId,
        bookTitle: props.bookInfo.title,
        tagNames: chosenTagArray,
      };
      // console.log("新筆記資料包===>", inputData);

      if (!props.noteData) {
        await firebase.addNewNote(userId, inputData);
      } else {
        await firebase.addNewNote(userId, inputData, props.bookInfo.noteId);
      }

      // 把標籤加到書本

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

      props.show(false);
      // chosenTagArray = [];
    }
  }

  function closeInput(e) {
    if (inputRef.current === e.target) {
      props.show(false);
    }
  }

  function tagInputHandler(index) {
    setShowInputModal(true);
    selectedTagBox = index;
  }

  return (
    <>
      <Background ref={inputRef} onClick={closeInput}>
        <TagBoxFlat onSubmit={submitHandler} as="form">
          <CloseButton onClick={() => props.show((prev) => !prev)}>
            X
          </CloseButton>

          <Title>筆記標題</Title>
          <TitleInput
            name="title"
            defaultValue={props.noteData ? props.noteData.title : ""}
            onChange={inputChangeHandler}
            placeholder={"ex.書摘"}
          ></TitleInput>

          <Title>頁數</Title>
          <TitleInput
            name="page"
            defaultValue={props.noteData ? props.noteData.page : ""}
            onChange={inputChangeHandler}
          ></TitleInput>

          <Title>選擇此筆記的書籤</Title>
          {groupData?.map((data, index) => (
            <TagContentBox key={data.name}>
              <SubTitle key={data.name}>{data.name}</SubTitle>

              <TagsContainer key={index}>
                {data.tags.map((tag, tagIndex) => (
                  <label name={tag} key={tagIndex}>
                    <Input
                      id={tag}
                      defaultChecked={
                        props.noteData
                          ? props.noteData.tagNames.includes(tag)
                          : false
                      }
                      key={`${tag}${tagIndex}`}
                    ></Input>
                    <Tag onClick={() => choseTagHandler(tag)} key={tag}>
                      {tag}
                    </Tag>
                  </label>
                ))}
                {/* <AddTagSign
                  onClick={() => tagInputHandler(index)}
                  title="新增標籤"
                /> */}

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
            <ContentInput
              defaultValue={props.noteData ? props.noteData.content : ""}
              name="content"
              onChange={inputChangeHandler}
            ></ContentInput>
          </div>
          <SubmitButton>{props.noteData ? "修改" : "新增"}</SubmitButton>
        </TagBoxFlat>
        {showInputModal && (
          <InputModal
            groupData={currentGroups}
            setGroupData={setGroupData}
            setShowInputModal={setShowInputModal}
            modalTitle={"標籤名稱"}
            selectedBoxIndex={selectedTagBox}
          />
        )}
      </Background>
    </>
  );
};

export default NewNote;
