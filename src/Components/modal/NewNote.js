import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { userRef, booksRef, notesRef } from "../../utils/fireBaseRef";
import firebase from "../../utils/firebaseTools";

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
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  padding: 20px;
  width: 60%;
  height: 600px;
  margin-bottom: 20px;
  background-color: white;
  border: 2px solid #ece6e6;
  border-radius: 10px;
  ${"" /* z-index: 99; */}
`;

const BoxContent = styled(Flex)`
  width: 80%;
  margin: 8px;
  padding: 8px;
  border-radius: 10px;
  background-color: #d8d7d7;
`;
const TagsContainer = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  width: 80%;
  gap: 1em;
`;
const SubTitle = styled.h3`
  width: 20%;
  font-size: 14px;
  margin-right: 10px;
`;

const Input = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;
const Tag = styled.p`
  margin: 0;
  padding: 4px 6px;
  font-size: 12px;
  background-color: #f6f6f6;
  border-radius: 5px;
  ${Input}:checked + && {
    background-color: #ffb226;
  }
`;
const Form = styled.form``;
const TitleInput = styled.input``;
const PageInput = styled.input``;
const ContentInput = styled.textarea`
  width: 40vw;
  height: 25vh;
`;
const Button = styled.button``;

const AddTag = styled(AddCircle)`
  width: 22px;
  color: #df8907;
`;
const userID = "E5EiDYKVIUd0wuHie6N5";
let chosenTagArray = [];
let currentGroups = [];
let groupArray = [];
const NewNote = (props) => {
  let inputData = {
    bookID: "",
    id: "",
    bookTitle: "",
    content: "",
    page: "",
    title: "",
    tagNames: [],
  };
  const [groupData, setGroupData] = useState([]);
  const [inputArray, setInputArray] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [noteTitleInput, setNoteTitleInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    chosenTagArray = [];
    let data = [];
    firebase.getTagGroupsData(userID).then((res) => {
      data.push(...res.tagGroups);
      setGroupData(data);
      currentGroups = [...data];
      for (let i = 0; i < data.length; i++) {
        groupArray.push(false);
      }
    });

    if (props.noteData) {
      chosenTagArray = [...props.noteData.tagNames];
      setNoteTitleInput(props.noteData.title);
      setPageInput(props.noteData.page);
      setNoteInput(props.noteData.content);
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

    if (chosenTagArray.length === 0) {
      alert("每個筆記需要至少一個標籤");
    } else if (!noteTitleInput) {
      alert("請輸入筆記標題");
    } else if (!noteInput) {
      alert("請輸入筆記內容");
    } else {
      // 建立新筆記
      // newNoteRef.id
      const newNoteRef = doc(notesRef);

      inputData = {
        bookID: props.bookInfo.id,
        id: props.noteData ? props.bookInfo.noteId : newNoteRef.id,
        bookTitle: props.bookInfo.title,
        content: noteInput,
        page: pageInput,
        title: noteTitleInput,
        tagNames: chosenTagArray,
      };
      console.log("新筆記資料包===>", inputData);
      // console.log(props.bookInfo.id);
      // 路徑錯誤。解決不了ID問題
      if (!props.noteData) {
        // console.log(props.noteId);
        await setDoc(newNoteRef, inputData);
      } else {
        await setDoc(doc(notesRef, props.bookInfo.noteId), inputData);
      }

      // 把標籤加到書本
      const book = await getDoc(doc(booksRef, props.bookInfo.id));
      book.data().tagNames.forEach((tag) => {
        if (!chosenTagArray.includes(tag)) {
          chosenTagArray.push(tag);
        }
      });

      await updateDoc(doc(booksRef, props.bookInfo.id), {
        tagNames: chosenTagArray,
      });
      props.show(false);
      chosenTagArray = [];
    }
  }

  function closeInput(e) {
    if (inputRef.current === e.target) {
      props.show(false);
    }
  }

  function tagInputHandler(index) {
    if (inputArray.includes(true)) {
      groupArray.splice(index, 1, false);
      setInputArray([...groupArray]);
    } else {
      groupArray.splice(index, 1, true);
      setInputArray([...groupArray]);
    }
  }
  async function updateTagGroup(datas) {
    await updateDoc(userRef, {
      tagGroups: datas,
    });
  }

  function addTagHandler(name) {
    if (!tagInput) {
      alert("請輸入要新增的標籤");
    } else {
      currentGroups.forEach((item, index) => {
        if (item.name === name) {
          currentGroups[index].tags.push(tagInput);
          setGroupData([...currentGroups]);
          groupArray.splice(index, 1, false);
          setInputArray([...groupArray]);
          updateTagGroup(groupData);
        } else {
          console.log("no match");
        }
      });
    }
  }

  return (
    <>
      <Background ref={inputRef} onClick={closeInput}>
        <TagBoxFlat>
          <h3>選擇此筆記的書籤</h3>
          <Button onClick={() => props.show((prev) => !prev)}>X</Button>
          {groupData?.map((data, index) => (
            <BoxContent key={data.name}>
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
                <AddTag onClick={() => tagInputHandler(index)} />
                {inputArray[index] && (
                  <div key={data.name}>
                    <input
                      onChange={(e) => setTagInput(e.target.value)}
                      key={`${data.name}${index}`}
                    />
                    <button
                      onClick={() => addTagHandler(data.name)}
                      key={index}
                    >
                      確認
                    </button>
                  </div>
                )}
              </TagsContainer>
            </BoxContent>
          ))}

          <Form onSubmit={submitHandler} as="form">
            <TagsContainer>
              <div>
                <h3>筆記標題</h3>
                <TitleInput
                  name="title"
                  defaultValue={
                    props.noteData ? props.noteData.title : noteTitleInput
                  }
                  onChange={(e) => setNoteTitleInput(e.target.value)}
                  placeholder={"ex.書摘"}
                ></TitleInput>
              </div>
              <div>
                <h3>頁數</h3>
                <PageInput
                  name="page"
                  defaultValue={
                    props.noteData ? props.noteData.page : pageInput
                  }
                  onChange={(e) => setPageInput(e.target.value)}
                ></PageInput>
              </div>
            </TagsContainer>
            <div>
              <h3>筆記內容</h3>
              <ContentInput
                defaultValue={
                  props.noteData ? props.noteData.content : noteInput
                }
                onChange={(e) => setNoteInput(e.target.value)}
              ></ContentInput>
            </div>
            <Button>新增</Button>
          </Form>
        </TagBoxFlat>
      </Background>
    </>
  );
};

export default NewNote;
