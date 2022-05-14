import { serverTimestamp } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";
import image from "../image/book.png";

// align-item: flex-start。讓flexbox不要stretch
// const Wrapper = styled.div`
//   display: flex;
//   width: 100%;
//   flex-wrap: wrap;
// `;

const AllCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  @media only screen and (max-width: 1100px) {
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
  @media only screen and (max-width: 1100px) {
    width: 60vw;
  }
  @media only screen and (max-width: 786px) {
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
  @media only screen and (max-width: 1100px) {
    width: 18vw;
  }
  @media only screen and (max-width: 786px) {
    width: 150px;
  }
  @media only screen and (max-width: 425px) {
    width: 180px;
    margin-bottom: 0px;
  }
`;
const BookImage = styled.img`
  width: 100%;
  height: auto;
  ${"" /* object-fit: contain; */}
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

  @media only screen and (max-width: 1100px) {
    width: 50%;
  }
  @media only screen and (max-width: 425px) {
    justify-content: center;
    align-items: center;
    width: 80%;
    margin-top: 0px;
  }
`;

const BookTextContainer = styled.div`
  @media only screen and (max-width: 425px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const BookName = styled.h3`
  margin: 6px;
  @media only screen and (max-width: 425px) {
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

  async function getBookData(book, title, authors, publisher, date, img) {
    console.log(book);

    props.setIsLoading(true);
    if (date === undefined) {
      date = "無資料";
    } else if (authors === undefined) {
      authors = ["無資料"];
    } else if (publisher === undefined) {
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
    console.log(data);
    const newBookId = firebase.setNewBookRef(userId);
    await firebase.addNewBook(userId, newBookId, data).then(() => {
      props.setIsLoading(false);
      navigate(`/booknote/${newBookId}`, { state: data });
    });
  }

  return (
    // <Wrapper>
    <AllCardsContainer>
      {props.bookList?.map((book, index) => {
        let img = book.imageLinks;
        return (
          <CardContainer key={index}>
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
                    book,
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
    // </Wrapper>
  );
}
export default Card;
