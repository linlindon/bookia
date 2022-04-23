import { useState } from "react";
import styled from "styled-components";
import uniqid from "uniqid";
import NewNote from "./modal/NewNote";

const BoxName = styled.h4`
  width: 80%;
  padding-bottom: 10px;
  text-align: center;
  font-size: 16px;
  border-bottom: 2px solid #ece6e6;
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
const AddSign = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px black;
  line-height: 2.5;
`;
const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;
const TagBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 20px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
`;
const DeleteSign = styled.span``;

function NoteBox(props) {
  console.log("NoteBox");
  console.log(props.bookNotesData);
  const [showUpdate, setShowUpdate] = useState(false);

  const [noteId, setNoteId] = useState("");

  async function updateNote(id) {
    setNoteId(id);
    setShowUpdate(true);
  }

  return (
    <>
      {props.bookNotesData?.map((item) => (
        <TagBox key={uniqid()}>
          <BoxName>{item.title}</BoxName>
          <BookName>書名：{item.bookTitle}</BookName>
          <BookName>頁數：{item.page}</BookName>

          <TagsContainer>
            {item.tagNames.map((tag) => (
              <Tag key={uniqid()}>
                {tag}
                <DeleteSign key={uniqid()}>x</DeleteSign>
              </Tag>
            ))}
            <p>{item.content}</p>
            <AddSign onClick={() => updateNote(item.id)} key={uniqid()}>
              修改
            </AddSign>
          </TagsContainer>
        </TagBox>
      ))}
      {showUpdate ? (
        <NewNote
          noteId={noteId}
          showNoteInput={props.showNoteInput}
          setShowNoteInput={props.setShowNoteInput}
        />
      ) : null}
    </>
  );
}

export default NoteBox;
