import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { userRef, booksRef, notesRef } from "../utils/fireBaseConfig";
import NewNote from "../components/NewNote";

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

const Button = styled.button``;

function BookNote() {
  const [bookNotesData, setBookNotesData] = useState([]);
  const [showNoteInput, setShowInput] = useState(false);
  const [choseTag, setChoseTag] = useState([]);

  useEffect(() => {
    let noteData = [];
    onSnapshot(notesRef, (notes) => {
      notes.forEach((note) => {
        if (note.data().bookTitle === "假資料") {
          noteData.push(note.data());
        }
      });
    });
    setBookNotesData(noteData);
  }, []);

  const noteForm = () => {
    setShowInput((prev) => !prev);
  };
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
          <Button onClick={noteForm}>新增筆記</Button>
        </NoteBox>
        {showNoteInput ? (
          <NewNote showNoteInput={showNoteInput} setShowInput={setShowInput} />
        ) : null}
        {bookNotesData?.map((item) => (
          <>
            <h2>{item.bookTitle}</h2>
            <p>{item.content}</p>
          </>
        ))}
      </Container>
    </>
  );
}

export default BookNote;
