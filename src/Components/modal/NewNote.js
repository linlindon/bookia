import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";
import { getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { userRef, booksRef, notesRef } from "../../utils/fireBaseRef";

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

let chosenTagArray = [];
let currentGroups = [];
let groupArray = [];
const NewNote = (props) => {
  const [groupData, setGroupData] = useState([]);
  const [inputArray, setInputArray] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [noteTitleInput, setNoteTitleInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    let data = [];
    async function getTagGroupData() {
      const userDoc = await getDoc(userRef);
      data.push(...userDoc.data().tagGroups);
      setGroupData(data);
      currentGroups = [...data];
      for (let i = 0; i < data.length; i++) {
        groupArray.push(false);
      }
      setInputArray(groupArray);
    }
    getTagGroupData();
  }, []);

  function choseTagHandler(tag) {
    console.log("選擇的標籤", tag);
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

  let inputData = {};
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
      const newNoteRef = doc(notesRef);
      inputData = {
        bookID: props.id,
        id: newNoteRef.id,
        bookTitle: props.title,
        content: noteInput,
        page: pageInput,
        title: noteTitleInput,
        tagNames: chosenTagArray,
      };
      // console.log("新筆記資料包===>", inputData);
      await setDoc(newNoteRef, inputData);

      // 把標籤加到書本
      const book = await getDoc(doc(booksRef, props.id));
      book.data().tagNames.forEach((tag) => {
        if (chosenTagArray.includes(tag)) {
          console.log("重複的標籤===", tag);
          return;
        } else {
          chosenTagArray.push(tag);
        }
      });

      await updateDoc(doc(booksRef, props.id), {
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
                    <Input id={tag} key={`${tag}${tagIndex}`}></Input>
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
                  value={props.noteData.title}
                  onChange={(e) => setNoteTitleInput(e.target.value)}
                  placeholder={"ex.書摘"}
                ></TitleInput>
              </div>
              <div>
                <h3>頁數</h3>
                <PageInput
                  value={props.noteData ? props.noteData.page : pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                ></PageInput>
              </div>
            </TagsContainer>
            <div>
              <h3>筆記內容</h3>
              <ContentInput
                value={props.noteData ? props.noteData.content : noteInput}
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
