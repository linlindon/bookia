import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { NoteAdd } from "@styled-icons/fluentui-system-filled/NoteAdd";
import { onSnapshot } from "firebase/firestore";
import firebase from "../utils/firebaseTools";
import NewNote from "../components/modal/NewNoteModal";
import NoteBox from "../components/NoteBox";
import { UserProfile } from "../App";

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
const TitleBookContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
  margin-bottom: 30px;
  ${"" /* background-color: #3fccdc; */}
`;
const NoteBoxContainer = styled(Flex)`
  align-items: center;
  padding: 20px;
  width: 60%;
  margin-bottom: 30px;
  border: 2px solid #ece6e6;
  border-radius: 10px;

  background-color: #ffffff;
`;

const BookImg = styled.div`
  width: 120px;
  border: solid 1px #f2f1f0;
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

const Button = styled(NoteAdd)`
  position: fixed;
  right: 6%;
  bottom: 5%;
  width: 50px;
  height: 50px;
  color: #3fccdc;
  cursor: pointer;

  @media only screen and (max-width: 786px) {
    width: 40px;
  }
`;

function BookNote() {
  const [bookNotesData, setBookNotesData] = useState([]);
  const [bookInfo, setBookInfo] = useState({});
  const [showNoteInput, setShowNoteInput] = useState(false);
  const { id } = useParams();
  const userId = useContext(UserProfile);

  useEffect(() => {
    firebase.getBookInfo(userId, id).then((res) => {
      setBookInfo({ ...res });
    });
  }, []);

  useEffect(() => {
    let noteData = [];
    let notesRef = firebase.getNotesRef(userId);
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
        <TitleBookContainer>
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
          </NoteBoxContainer>
        </TitleBookContainer>
        <Button
          onClick={() => setShowNoteInput((prev) => !prev)}
          title={"新增筆記"}
        />
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
