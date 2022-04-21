import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { userRef, booksRef, notesRef } from "../utils/fireBaseConfig";
import NewNote from "../components/NewNote";
import NoteBox from "../components/NoteBox";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled(Flex)`
  flex-direction: column;
  align-items: center
  margin-bottom: 30px;
`;
const Title = styled.h1`
  width: 70%;
  text-align: center;
  border-bottom: 1px solid black;
`;
const NoteBoxContainer = styled(Flex)`
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
  const [bookInfo, setBookInfo] = useState([]);
  const [showNoteInput, setShowInput] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    let noteData = [];
    onSnapshot(notesRef, (notes) => {
      console.log("snapshot");
      notes.forEach((note) => {
        console.log("inside snapshot", id);
        if (note.data().bookID === id) {
          console.log(note.data());
          noteData.push(note.data());
        }
      });
      setBookNotesData(noteData);
    });
    // const info = await getDoc(doc(booksRef, id));
    // setBookInfo(info.data());

    async function getBookInfo() {
      console.log(id);
      const info = await getDoc(doc(booksRef, id));
      setBookInfo(info.data());
    }
    getBookInfo();
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
  }

  return (
    <>
      <Container>
        <Title>新增筆記</Title>
        <NoteBoxContainer>
          <BookImg>
            <Img src="https://picsum.photos/200/300" alt="" />
          </BookImg>
          <ContentContainer>
            <BookTitle>書名: {bookInfo.title}</BookTitle>
            <p>作者: {bookInfo.author}</p>
            <p>出版年: {bookInfo.publish}</p>
            <Button onClick={addNewBook}>建立書本資料按鈕</Button>
          </ContentContainer>
          <Button onClick={noteForm}>新增筆記</Button>
        </NoteBoxContainer>
        {showNoteInput ? (
          <NewNote showNoteInput={showNoteInput} setShowInput={setShowInput} />
        ) : null}
        <NoteBox bookNotesData={bookNotesData} />
      </Container>
    </>
  );
}

export default BookNote;
