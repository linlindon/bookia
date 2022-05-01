import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import firebase from "../utils/firebaseTools";
import NewNote from "../components/modal/NewNoteModal";
import NoteBox from "../components/NoteBox";
import { UserProfile } from "../App";

const firebaseConfig = {
  apiKey: "AIzaSyBM3IamCWyJi_8vyVPP34KUixJJKXlAwQ8",
  authDomain: "bookia-280d8.firebaseapp.com",
  projectId: "bookia-280d8",
  storageBucket: "bookia-280d8.appspot.com",
  messagingSenderId: "330107513484",
  appId: "1:330107513484:web:b81b9e8f3748a595dd69a9",
};

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
  const userId = useContext(UserProfile);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const notesRef = collection(db, "users", userId, "notes");

  useEffect(() => {
    console.log(userId, id);
    firebase.getBookInfo(userId, id).then((res) => {
      console.log(res);
      setBookInfo({ ...res });
    });
  }, []);

  useEffect(() => {
    let noteData = [];
    onSnapshot(notesRef, (notes) => {
      console.log("in snap shot");
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
            <Img src={bookInfo.img} alt="" />
          </BookImg>
          <ContentContainer>
            <BookTitle>書名: {bookInfo.title}</BookTitle>
            <p>作者:{bookInfo.authors && bookInfo.authors.join("、")}</p>

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
