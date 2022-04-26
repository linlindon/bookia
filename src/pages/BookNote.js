import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { booksRef, notesRef } from "../utils/fireBaseRef";
import NewNote from "../components/modal/NewNote";
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
  const [bookInfo, setBookInfo] = useState({});
  const [showNoteInput, setShowNoteInput] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function getBookInfo() {
      const info = await getDoc(doc(booksRef, id));
      console.log("檢查圖片URL", info.data());
      // console.log(info.data());
      setBookInfo({ ...info.data() });
    }
    getBookInfo();
    // 監聽是否有新增的筆記
  }, []);

  useEffect(() => {
    console.log("booknote render");
    let noteData = [];
    onSnapshot(notesRef, (notes) => {
      let data = [];
      notes.forEach((note) => {
        if (note.data().bookID === id) {
          data.push(note.data());
        }
      });
      noteData = data;
      setBookNotesData(noteData);
    });
  }, []);

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
          </ContentContainer>
          <Button onClick={() => setShowNoteInput((prev) => !prev)}>
            新增筆記
          </Button>
        </NoteBoxContainer>
        {showNoteInput ? (
          <NewNote
            showNoteInput={showNoteInput}
            show={setShowNoteInput}
            bookInfo={bookInfo}
          />
        ) : null}
        <NoteBox bookNotesData={bookNotesData} />
      </Container>
    </>
  );
}

export default BookNote;
