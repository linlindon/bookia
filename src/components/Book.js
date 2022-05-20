import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: 3% 15%;

  @media only screen and (max-width: 1280px) {
    margin: 2% 6%;
  }
  @media only screen and (max-width: 768px) {
    padding: 0 2%;
  }
`;

const BookBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  width: calc((100% - 82px) / 2);
  min-height: 52vh;
  margin: 30px 20px;
  border-radius: 10px;
  background-color: #ffffff;
  cursor: pointer;
  transition: background 0.5s, border-color 0.5s, box-shadow 0.5s, outline 0.5s;

  &:hover {
    box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);
    background-color: #eeeded;
  }
  @media only screen and (max-width: 1280px) {
    width: calc((100% - 42px) / 2);
    min-height: 45vh;
    margin: 12px 8px;
  }

  @media only screen and (max-width: 768px) {
    width: 80vw;
  }
  @media only screen and (max-width: 426px) {
    flex-direction: column;
    align-items: center;
  }
`;

const BookImg = styled.div`
  width: 185px;
  overflow: hidden;
  margin: 32px 15px;
  @media only screen and (max-width: 1280px) {
    margin: 18px 10px 15px 0px;
  }
  @media only screen and (max-width: 426px) {
    margin: 15px 0 5px 0;
  }
`;
const Img = styled.img`
  width: 100%;
  height: auto;
  border: solid 1px #eeeded;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 230px;
  margin: 23px 10px;
  font-size: 16px;
  font-weight: 500;
  @media only screen and (max-width: 1280px) {
    margin: 8px 10px 15px 10px;
  }
  @media only screen and (max-width: 426px) {
    text-align: center;
    align-items: center;
    margin: 10px 0 18px 0;
    width: 95%;
  }
`;

const BookTitle = styled.h3`
  margin: 8px 0px 5px 0px;
  font-size: 16px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  @media only screen and (max-width: 426px) {
    justify-content: center;
  }
`;
const Tag = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 15px;
  background-color: #e4d36d;
  ${BookBox}:hover & {
    background-color: #ffffff;
  }
`;

function Book(props) {
  let navigate = useNavigate();

  return (
    <Container>
      {props.bookDatas?.map((book, index) => (
        <BookBox onClick={() => navigate(`/booknote/${book.id}`)} key={book.id}>
          <BookImg key={book.img}>
            <Img src={book.img} key={`${book}${index}`} alt="book photo" />
          </BookImg>
          <ContentContainer key={book}>
            <div>
              <BookTitle key={book.title}>{book.title}</BookTitle>
              <p>作者:{book.authors.join("、")}</p>
            </div>
            <TagsContainer key={`${book}${book.id}`}>
              {book.tagNames?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </ContentContainer>
        </BookBox>
      ))}
    </Container>
  );
}

Book.propTypes = {
  bookDatas: PropTypes.array,
};

export default Book;
