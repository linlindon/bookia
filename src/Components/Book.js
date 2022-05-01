import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import uniqid from "uniqid";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const NoteBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  width: 60%;
  margin-bottom: 20px;
  border: 2px solid #ece6e6;
  border-radius: 10px;
`;

const BookImg = styled.div`
  width: 120px;
  border: 1px solid #ece6e6;
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

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`;
const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;

function Book(props) {
  let navigate = useNavigate();
  console.log(props.bookDatas);

  function redirectBookPage(id) {
    navigate(`/booknote/${id}`);
  }
  return (
    <>
      {props.bookDatas?.map((book) => (
        <Container onClick={() => redirectBookPage(book.id)} key={uniqid()}>
          <NoteBox key={uniqid()}>
            <BookImg key={uniqid()}>
              <Img key={uniqid()} src={book.img} alt="" />
            </BookImg>
            <ContentContainer key={uniqid()}>
              <BookTitle key={uniqid()}>書名: {book.title}</BookTitle>
              <TagsContainer key={uniqid()}>
                {book.tagNames?.map((tag) => (
                  <Tag key={uniqid()}>{tag}</Tag>
                ))}
              </TagsContainer>
            </ContentContainer>
          </NoteBox>
        </Container>
      ))}
    </>
  );
}

export default Book;
