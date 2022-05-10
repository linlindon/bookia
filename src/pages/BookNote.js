import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { NoteAdd } from "@styled-icons/fluentui-system-regular/NoteAdd";
import { onSnapshot } from "firebase/firestore";
import firebase from "../utils/firebaseTools";
import NewNoteModal from "../components/modal/NewNoteModal";
import NoteBox from "../components/NoteBox";
import Loading from "../components/Loading";
import { UserProfile } from "../App";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled(Flex)`
  flex-direction: column;
  align-items: center;
`;
const Title = styled.h1`
  width: 70%;
  text-align: center;
`;
const TitleContainer = styled(Flex)`
  flex-direction: column;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 5% 15%;
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
  margin: 0;
`;

const NoDataContainer = styled.div`
  display: flex;
  width: 100%;
  align-self: flex-start;
  justify-content: space-evenly;
`;
const NoDataTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  text-align: center;
`;
const SignContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 5.5%;
  bottom: 5%;
  width: 65px;
  height: 65px;
  border-radius: 30px;
  background-color: #ffffff;

  box-shadow: 2px 3px 7px rgb(0 0 0 / 15%);
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 2px 10px rgba(0 0 0 / 30%);
  }
`;
const AddButton = styled(NoteAdd)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  color: #dca246;
  cursor: pointer;

  @media only screen and (max-width: 786px) {
    width: 40px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

function BookNote() {
  // render畫面使用
  const [bookNotesData, setBookNotesData] = useState([]);
  // const [bookInfo, setBookInfo] = useState({});
  // 如果是修改note，就要傳noteData到表格裡面
  const [noteData, setNoteData] = useState(undefined);
  const [bookInfo, setBookInfo] = useState([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const userId = useContext(UserProfile);

  useEffect(() => {
    console.log("inside effect");
    setIsLoading(true);
    firebase.getBookInfo(userId, id).then((res) => {
      setIsLoading(false);
      console.log(res);
      setBookInfo({ ...res });
    });
  }, []);

  useEffect(() => {
    // let noteData = [];
    let notesRef = firebase.getNotesRef(userId);
    setIsLoading(true);
    onSnapshot(notesRef, (notes) => {
      console.log("in snap shot");
      let data = [];
      notes.forEach((note) => {
        if (note.data().bookID === id) {
          data.push(note.data());
        }
      });
      // noteData = data;
      setIsLoading(false);
      setBookNotesData(data);
    });
  }, []);

  function showNoteInputHandler() {
    setNoteData(undefined);
    setShowNoteInput(true);
  }

  return (
    <>
      <Container>
        <TitleContainer>
          <Title>新增筆記</Title>
        </TitleContainer>
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
        <SignContainer>
          <AddButton onClick={showNoteInputHandler} title={"新增筆記"} />
        </SignContainer>

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
          {bookNotesData.length === 0 ? (
            <NoDataContainer>
              <NoDataTitle>
                無筆記
                <br />
                請點擊右下按鈕新增筆記
              </NoDataTitle>
            </NoDataContainer>
          ) : (
            <NoteBox
              bookNotesData={bookNotesData}
              setShowNoteInput={setShowNoteInput}
              setNoteData={setNoteData}
              // bookInfo={bookInfo}
            />
          )}
        </Wrapper>
      </Container>
      {showNoteInput ? (
        <NewNoteModal
          showNoteInput={showNoteInput}
          setShowNoteInput={setShowNoteInput}
          bookInfo={bookInfo}
          noteData={noteData}
        />
      ) : null}
    </>
  );
}

export default BookNote;
