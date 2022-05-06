import { useState, useContext } from "react";
import styled from "styled-components";
import { Edit } from "@styled-icons/fa-regular/Edit";
import firebase from "../utils/firebaseTools";
import NewNote from "./modal/NewNoteModal";
import { UserProfile } from "../App";

const TagBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 20px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 2px 2px 7px rgb(0 0 0 / 20%);
`;

const BoxName = styled.h4`
  width: 80%;
  padding-bottom: 10px;
  text-align: center;
  font-size: 16px;
  border-bottom: 2px solid #6a7fdb;
`;
const BookName = styled.div`
  display: block;
  margin-bottom: 5px;
`;
const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  gap: 1em;
`;
const AddSign = styled(Edit)`
  width: 30px;
  height: 30px;
  margin-bottom: 20px;
  color: #6a7fdb;
  cursor: pointer;
`;
const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #00d084;
  border-radius: 5px;
`;
const DeleteSign = styled.span``;

function NoteBox(props) {
  const [showUpdate, setShowUpdate] = useState(false);
  const [noteData, setNoteData] = useState({});
  const [bookInfo, setBookInfo] = useState([]);
  const userId = useContext(UserProfile);
  // setBookInfo要加入book id & book title，為了讓NewNote送出資料
  async function updateNote(id) {
    let info = {};
    await firebase.getNoteData(userId, id).then((data) => {
      setNoteData(data);
      console.log(data);
      info = { id: data.bookID, title: data.bookTitle, noteId: id };
    });
    setShowUpdate(true);
    setBookInfo(info);
    // console.log("NoteBox bookInfo", info);
  }

  return (
    <>
      {props.bookNotesData?.map((item, index) => (
        <TagBox key={`${item}${index}`}>
          <BoxName key={item.title}>{item.title}</BoxName>
          <BookName key={item.bookTitle}>書名：{item.bookTitle}</BookName>
          <BookName key={item.page}>頁數：{item.page}</BookName>

          <TagsContainer key={`${item}`}>
            {item.tagNames.map((tag) => (
              <Tag key={tag}>
                {tag}
                <DeleteSign key={`delete${tag}`} />
              </Tag>
            ))}
            <p key={item.content}>{item.content}</p>

            <AddSign
              onClick={() => updateNote(item.id)}
              title="修改"
              key={item.id}
            />
          </TagsContainer>
        </TagBox>
      ))}
      {showUpdate ? (
        <NewNote noteData={noteData} show={setShowUpdate} bookInfo={bookInfo} />
      ) : null}
    </>
  );
}

export default NoteBox;
