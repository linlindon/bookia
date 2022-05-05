import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%
  padding: 0 5%;

  @media only screen and (min-width: 1280px) {
    width: 1280px; 
    align-items: center;
  }
  @media only screen and (max-width: 786px) {
    padding: 0 2%;
  }
`;

const BookBox = styled.div`
  display: flex;
  padding: 20px;
  width: 48%;
  margin: 1%;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 2px 2px 7px rgb(0 0 0 / 20%);
  cursor: pointer;
  flex-direction: row-reverse;

  &:hover {
    transform: scale(1.05);
    background-color: #3fccdc;
  }
  @media only screen and (min-width: 785px) {
    ${"" /* width: 42%; */}
  }
  @media only screen and (max-width: 785px) {
    width: 100%;
  }
`;

const BookImg = styled.div`
  width: 150px;
  height: 220px;
  margin-right: 10px;
  border: 1px solid #ece6e6;
`;
const Img = styled.img`
  width: 100%;
  object-fit: cover;
`;
const ContentContainer = styled.div`
  width: 80%;
`;

const BookTitle = styled.h3`
  margin: 8px 0px 5px 0px;
  font-size: 16px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`;
const Tag = styled.p`
  margin: 0;
  padding: 2px 4px;
  font-size: 14px;
  border: 2px solid #00d084;
  border-radius: 5px;

  ${BookBox}:hover & {
    background-color: #ffffff;
  }
`;

function Book(props) {
  let navigate = useNavigate();
  console.log(props.bookDatas);

  return (
    <Container>
      <Wrapper>
        {props.bookDatas?.map((book, index) => (
          <>
            <BookBox
              onClick={() => navigate(`/booknote/${book.id}`)}
              key={book.id}
            >
              <BookImg key={book.img}>
                <Img src={book.img} alt="" />
              </BookImg>
              <ContentContainer key={book}>
                <BookTitle key={book.title}>{book.title}</BookTitle>
                <p>作者:{book.authors.join("、")}</p>
                <TagsContainer key={index}>
                  {book.tagNames?.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagsContainer>
              </ContentContainer>
            </BookBox>
          </>
        ))}
      </Wrapper>
    </Container>
  );
}

export default Book;
