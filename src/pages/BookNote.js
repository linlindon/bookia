import { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { onSnapshot } from "firebase/firestore";

import firebase from "../utils/firebaseTools";
import NewNoteModal from "../components/modal/NewNoteModal";
import NoteBox from "../components/NoteBox";
import LoadingModal from "../components/modal/LoadingModal";
import { UserProfile } from "../App";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled(Flex)`
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  width: 70%;
  align-items: flex-start;
  margin: 3% 15%;
`;
const BookInfoContainer = styled(Flex)`
  align-items: flex-start;
  align-self: flex-start;
  padding: 15px;
  width: 600px;
  border-radius: 10px;
  background-color: #ffffff;
`;

const BookImg = styled.div`
  width: 180px;
  border: solid 1px #f2f1f0;
`;
const Img = styled.img`
  width: 100%;
  object-fit: cover;
`;
const ContentContainer = styled.div`
  width: 100%;
  padding-left: 10px;
`;
const BookTitle = styled.h3`
  margin: 0 0 15px 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

function BookNote() {
  const [bookNotesData, setBookNotesData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [noteData, setNoteData] = useState(undefined);
  const [bookInfo, setBookInfo] = useState([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const userId = useContext(UserProfile);

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      let notesRef = firebase.getNotesRef(userId);
      onSnapshot(notesRef, (notes) => {
        let data = [];
        notes.forEach((note) => {
          if (note.data().bookID === id) {
            data.push(note.data());
          }
        });
        firebase.getBookInfo(userId, id).then((res) => {
          setBookInfo({ ...res });
          setBookNotesData(data);
          setIsLoading(false);
        });
      });
    }
  }, [userId]);

  useEffect(() => {
    let data = [];
    if (userId) {
      firebase.getTagGroupsData(userId).then((res) => {
        data.push(...res.tagGroups);
        setGroupData(data);
      });
    }
  }, [userId]);

  function showNoteInputHandler() {
    setNoteData(undefined);
    setShowNoteInput(true);
  }

  return (
    <>
      <Container>
        {isLoading ? (
          <LoadingContainer>
            <LoadingModal />
          </LoadingContainer>
        ) : (
          <>
            <Wrapper>
              <BookInfoContainer>
                <BookImg>
                  <Img src={bookInfo.img} alt="" />
                </BookImg>
                <ContentContainer>
                  <BookTitle>{bookInfo.title}</BookTitle>
                  <p>作者:{bookInfo.authors && bookInfo.authors.join("、")}</p>
                  <p>出版年: {bookInfo.publish}</p>
                </ContentContainer>
              </BookInfoContainer>

              <NoteBox
                bookNotesData={bookNotesData}
                setShowNoteInput={setShowNoteInput}
                setNoteData={setNoteData}
                showNoteInputHandler={showNoteInputHandler}
              />
            </Wrapper>
          </>
        )}
      </Container>
      {showNoteInput && (
        <NewNoteModal
          showNoteInput={showNoteInput}
          setShowNoteInput={setShowNoteInput}
          bookInfo={bookInfo}
          noteData={noteData}
          setGroupData={setGroupData}
          groupData={groupData}
        />
      )}
    </>
  );
}

export default BookNote;
