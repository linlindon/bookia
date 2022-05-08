import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// const Wrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   margin: 5% 15%;
// `;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${"" /* width: 78%; */}

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
  flex-basis: 45%;
  flex-grow: 1;
  padding: 10px 20px;

  margin: 1%;
  border: 1px solid #ece6e6;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 2px 2px 7px rgb(0 0 0 / 20%);
  cursor: pointer;

  &:hover {
    ${"" /* transform: scale(1.05); */}
    ${"" /* background-color: #6a7fdb; */}
  }

  @media only screen and (max-width: 786px) {
    ${"" /* width: 100%; */}
    flex-basis: 100%;
    flex-direction: column;
  }
`;
const BoxName = styled.p`
  font-weight: 600;
  border-bottom: solid 2px #d3d2d1;
`;
const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
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
  margin-bottom: 5px;
`;
const Tag = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 15px;
  background-color: #e4d36d;
`;
const Content = styled.p``;
const DeleteSign = styled.span``;

function Note(props) {
  let navigate = useNavigate();
  return (
    // <Wrapper>
    <Container>
      {props.notesBoxData?.map((note, index) => (
        <NoteBox
          onClick={() => navigate(`/booknote/${note.bookID}`)}
          key={note}
        >
          <BoxName key={note.bookTitle}>書名: {note.bookTitle}</BoxName>
          <InfoContainer>
            <NoteName key={note.title}>{note.title}</NoteName>
            <Page key={note.page}>頁數: {note.page}</Page>
          </InfoContainer>
          <TagsContainer key={`${note.title}${index}`}>
            {note.tagNames.map((tag, tagIndex) => (
              <Tag key={tag}>
                {tag}
                <DeleteSign key={tagIndex} />
              </Tag>
            ))}
          </TagsContainer>
          <Content key={`${note.bookTitle}${index}`}>{note.content}</Content>
        </NoteBox>
      ))}
    </Container>
    // </Wrapper>
  );
}

export default Note;
