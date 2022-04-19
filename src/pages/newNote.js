import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { userRef, booksRef, notesRef } from "../utils/fireBaseConfig";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled(Flex)`
  flex-direction: column;
  margin-bottom: 30px;
`;
const Title = styled.h1`
  width: 70%;
  text-align: center;
  border-bottom: 1px solid black;
`;
const NoteBox = styled(Flex)`
  align-items: center;
  padding: 20px;
  width: 60%;
  margin-bottom: 20px;
  border: 2px solid #ece6e6;
  border-radius: 10px;
`;

const BookImg = styled.div`
  width: 120px;
`;
const Img = styled.img`
  width: 100%;
  object-fit: cover;
`;
const ContentContainer = styled.div`
  width: 80%;
  padding: 20px;
`;
const BookTitle = styled.h3``;
const TagBox = styled(NoteBox)`
  flex-direction: column;
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
const NewWrapper = styled(TagBox)``;
const TitleInput = styled.input``;
const PageInput = styled.input``;
const ContentInput = styled.textarea`
  width: 40vw;
  height: 25vh;
`;
const Button = styled.button``;

let chosenTagArray = [];
function NewNote() {
  const [groupData, setGroupData] = useState([]);
  const [noteTitleInput, setNoteTitleInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [choseTag, setChoseTag] = useState([]);
  useEffect(() => {
    let data = [];
    async function getTagGroupData() {
      const userDoc = await getDoc(userRef);
      data.push(...userDoc.data().tagGroups);
      setGroupData(data);
    }
    getTagGroupData();
  }, []);

  async function addNewBook() {
    const newBookRef = doc(booksRef);
    const fakeData = {
      author: "the who",
      id: newBookRef.id,
      img: "https://picsum.photos/200/300",
      publish: "2022",
      tagNames: [],
      time: serverTimestamp(),
      title: "假資料",
    };
    await setDoc(newBookRef, fakeData);

    console.log("hrer");
  }

  function choseTagHandler(tag) {
    if (chosenTagArray.includes(tag)) {
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
    } else {
      inputData = {
        bookID: "",
        bookTitle: "",
        content: noteInput,
        page: pageInput,
        title: noteTitleInput,
        tagNames: chosenTagArray,
      };
      console.log(inputData);
      const newNoteRef = doc(notesRef);
      await setDoc(newNoteRef, inputData);
    }
  }

  return (
    <>
      <Container>
        <Title>新增筆記</Title>
        <NoteBox>
          <BookImg>
            <Img src="https://picsum.photos/200/300" alt="" />
          </BookImg>
          <ContentContainer>
            <BookTitle>書名: 瀕臨崩潰邊緣的人</BookTitle>
            <p>作者: OOXXZZ</p>
            <p>出版年: 1960</p>
            <Button onClick={addNewBook}>建立書本資料按鈕</Button>
          </ContentContainer>
        </NoteBox>

        <TagBox>
          <h3>選擇此筆記的書籤</h3>

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
        </TagBox>
        <NewWrapper onSubmit={submitHandler} as="form">
          <TagsContainer>
            <div>
              <p>筆記標題</p>
              <TitleInput
                value={noteTitleInput}
                onChange={(e) => setNoteTitleInput(e.target.value)}
                placeholder={"ex.書摘"}
              ></TitleInput>
            </div>
            <div>
              <p>頁數</p>
              <PageInput
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
              ></PageInput>
            </div>
          </TagsContainer>
          <div>
            <p>筆記內容</p>
            <ContentInput
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            ></ContentInput>
          </div>
          <Button>新增</Button>
        </NewWrapper>
      </Container>
    </>
  );
}

export default NewNote;
