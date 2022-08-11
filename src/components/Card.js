import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { serverTimestamp } from "firebase/firestore";

import firebase from "../utils/firebaseTools";
import image from "../image/book.png";
import { UserProfile } from "../App";

const AllCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  width: calc((100% - 86px) / 2);
  margin: 30px 20px;
  border-radius: 10px;
  border: solid 0.5px #e4e4e4;
  background-color: #ffffff;
  transition: 0.5s ease;

  &:hover {
    box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);
    background-color: #eeeded;
  }
  @media only screen and (max-width: 1280px) {
    width: calc((100% - 42px) / 2);
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

const BookImageContainer = styled.div`
  width: 185px;
  overflow: hidden;
  margin: 32px 15px;
  @media only screen and (max-width: 1280px) {
    width: 18vw;
  }
  @media only screen and (max-width: 768px) {
    width: 150px;
  }
  @media only screen and (max-width: 426px) {
    width: 180px;
    margin-bottom: 0px;
  }
`;
const BookImage = styled.img`
  width: 100%;
  height: auto;
  border: solid 1px #eeeded;
`;
const AddButton = styled.button`
  border: none;
  width: 120px;
  height: 35px;
  letter-spacing: 2px;
  text-align: center;
  margin: 6px;
  padding: 3px 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #e6c88b;
  color: #fff;

  ${CardContainer}:hover & {
    background-color: #dca246;
  }
`;
const BookDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 230px;
  margin: 20px 20px 30px 20px;
  font-size: 16px;
  font-weight: 500;

  @media only screen and (max-width: 1280px) {
    width: 50%;
  }
  @media only screen and (max-width: 426px) {
    justify-content: center;
    align-items: center;
    width: 80%;
    margin-top: 0px;
  }
`;

const BookTextContainer = styled.div`
  @media only screen and (max-width: 426px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const BookName = styled.h3`
  margin: 6px;
  @media only screen and (max-width: 426px) {
    text-align: center;
  }
`;
const BookAuthor = styled.p`
  margin: 6px;
`;
const BookPublish = styled(BookAuthor)``;

function Card(props) {
  const userId = useContext(UserProfile);
  let navigate = useNavigate();

  async function getBookData(title, authors, publisher, date, img) {
    props.setIsLoading(true);
    if (date === undefined) {
      date = "無資料";
    }
    if (authors === undefined) {
      authors = ["無資料"];
    }
    if (publisher === undefined) {
      publisher = "無資料";
    }
    let data = {
      title: title,
      authors: authors,
      publisher: publisher,
      publish: date,
      img: img,
      id: "",
      tagNames: [],
      time: serverTimestamp(),
    };

    const newBookId = firebase.setNewBookRef(userId);
    await firebase.addNewBook(userId, newBookId, data).then(() => {
      props.setIsLoading(false);
      navigate(`/booknote/${newBookId}`);
    });
  }

  return (
    <AllCardsContainer>
      {props.bookList?.map((book, index) => {
        console.log(book);
        let img = book.imageLinks;
        return (
          <CardContainer key={book.canonicalVolumeLink + index}>
            <BookImageContainer>
              <BookImage src={img ? img.smallThumbnail : image} />
            </BookImageContainer>

            <BookDetail>
              <BookTextContainer>
                <BookName>{book.title}</BookName>
                <BookAuthor>
                  {book.authors && book.authors.join("、")}
                </BookAuthor>
                <BookPublish>{book.publishedDate}</BookPublish>
                <BookPublish>{book.publisher}</BookPublish>
              </BookTextContainer>
              <AddButton
                key={`books${index}`}
                onClick={() =>
                  getBookData(
                    book.title,
                    book.authors,
                    book.publisher,
                    book.publishedDate,
                    img ? img.thumbnail : image
                  )
                }
              >
                加到我的書櫃
              </AddButton>
            </BookDetail>
          </CardContainer>
        );
      })}
    </AllCardsContainer>
  );
}
export default Card;
