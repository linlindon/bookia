import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media only screen and (min-width: 1280px) {
    ${"" /* width: 1140px; */}
  }
  @media only screen and (max-width: 786px) {
    align-items: center;
    flex-direction: row;
    width: 82%;
  }
`;
const NoteBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 30px;
  margin: 15px;
  width: calc((100% - 250px) / 2);
  border: 1px solid #ece6e6;
  border-radius: 10px;
  background-color: #ffffff;
  flex-grow: 1;
  cursor: pointer;
  transition: 0.5s ease;

  &:hover {
    box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);
  }

  @media only screen and (max-width: 786px) {
    flex-basis: 100%;
    flex-direction: column;
  }
`;
const BoxName = styled.p`
  margin: 12px 0 3px 0;
  padding-bottom: 3px;
  font-weight: 600;
  border-bottom: solid 2px #d3d2d1;
`;
const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  margin: 10px 0;
  gap: 1em;
`;
const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
`;
const Page = styled.p`
  margin: 0;
`;
const NoteName = styled.div`
  font-weight: 700;
`;
const Tag = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 15px;
  background-color: #e4d36d;
`;

function Note(props) {
  let navigate = useNavigate();
  const parse = require("html-react-parser");
  return (
    // 可以和notebox 共用
    <Container>
      {props.notesBoxData?.map((note, index) => (
        <NoteBox
          onClick={() => navigate(`/booknote/${note.bookID}`)}
          key={`${note.bookID}${index}`}
        >
          <BoxName>書名: {note.bookTitle}</BoxName>
          <InfoContainer>
            <NoteName>{note.title}</NoteName>
            <Page>頁數: {note.page}</Page>
          </InfoContainer>
          <TagsContainer>
            {note.tagNames.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagsContainer>
          <div>{parse(note.content)}</div>
        </NoteBox>
      ))}
    </Container>
  );
}

export default Note;
