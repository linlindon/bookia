import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import {
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  userRef,
  booksRef,
  notesRef,
  newBookRef,
} from "../utils/fireBaseConfig";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
const TagBoxFlat = styled.div`
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 60%;
  ${"" /* height: 600px; */}
  margin-bottom: 20px;
  background-color: white;
  border: 2px solid #ece6e6;
  border-radius: 10px;
  z-index: 99;
`;
const Background = styled.div`
  width: 100%;
  height: 500px;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
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

let chosenTagArray = [];
const NewNote = (props) => {
  const [groupData, setGroupData] = useState([]);
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
    console.log(chosenTagArray);
    if (chosenTagArray.length === 0) {
      alert("每個筆記需要至少一個標籤");
    } else {
      // 建立新筆記
      const newNoteRef = doc(notesRef);
      inputData = {
        bookID: props.id,
        bookTitle: props.title,
        content: noteInput,
        page: pageInput,
        title: noteTitleInput,
        tagNames: chosenTagArray,
      };
      console.log("新筆記資料包===>", inputData);
      await setDoc(newNoteRef, inputData);

      // 把標籤加到書本
      const book = await getDoc(doc(booksRef, props.id));
      //如果他選的標籤已經在data裡面，就不用加進去

      book.data().tagNames.forEach((tag) => {
        if (chosenTagArray.includes(tag)) {
          console.log("重複的標籤===", tag);
          return;
        } else {
          chosenTagArray.push(tag);
        }
      });

      console.log(chosenTagArray);
      await updateDoc(doc(booksRef, props.id), {
        tagNames: chosenTagArray,
      });
      props.setShowInput(false);
      chosenTagArray = [];
    }
  }

  function closeInput(e) {
    if (inputRef.current == e.target) {
      props.setShowInput(false);
    }
  }
  return (
    <>
      <Background ref={inputRef} onClick={closeInput}>
        <TagBoxFlat>
          <h3>選擇此筆記的書籤</h3>
          <Button onClick={() => props.setShowInput((prev) => !prev)}>X</Button>
          {groupData?.map((data, index) => (
            <BoxContent key={index}>
              <SubTitle>{data.name}</SubTitle>

              <TagsContainer key={index}>
                {data.tags.map((tag, index) => (
                  <label name={tag}>
                    <Input id={tag}></Input>
                    <Tag onClick={() => choseTagHandler(tag)} key={index}>
                      {tag}
                    </Tag>
                  </label>
                ))}
              </TagsContainer>
            </BoxContent>
          ))}
          <Form onSubmit={submitHandler} as="form">
            <TagsContainer>
              <div>
                <h3>筆記標題</h3>
                <TitleInput
                  value={noteTitleInput}
                  onChange={(e) => setNoteTitleInput(e.target.value)}
                  placeholder={"ex.書摘"}
                ></TitleInput>
              </div>
              <div>
                <h3>頁數</h3>
                <PageInput
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                ></PageInput>
              </div>
            </TagsContainer>
            <div>
              <h3>筆記內容</h3>
              <ContentInput
                value={noteInput}
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
