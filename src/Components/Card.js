import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";

const AllCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 5% 40px 5%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  padding: 20px 10px;
`;

const BookImageContainer = styled.div`
  width: 130px;
  height: 200px;
`;
const BookImage = styled.img`
  width: 100%;
  object-fit: cover;
`;

const BookDetail = styled.div`
  text-align: center;
`;

const AddButton = styled.button`
  font-size: 14px;
  margin-top: 10px;
`;

const BookName = styled.h3``;
const BookAuthor = styled.p``;
const BookPublish = styled.p``;

function Card(props) {
  let navigate = useNavigate();
  const user = getAuth().currentUser;
  const userId = user.uid;

  async function getBookData(book, title, author, date, img) {
    console.log(book);
    let data = {
      title: title,
      author: author,
      publish: date,
      img: img,
      id: "",
      tagNames: [],
      time: serverTimestamp(),
    };

    const refId = firebase.setNewBookRef(userId);

    await firebase.addNewBook(userId, refId, data);
    navigate(`/booknote/${refId}`, { state: data });
  }

  return (
    <AllCardsContainer>
      {props.bookList?.map((book) => {
        let img = book.imageLinks;
        return (
          <CardContainer>
            <BookImageContainer>
              <BookImage
                src={img ? img.thumbnail : "https://picsum.photos/200/300"}
              />
            </BookImageContainer>
            <AddButton
              onClick={() =>
                getBookData(
                  book,
                  book.title,
                  book.authors,
                  book.publishedDate,
                  img ? img.thumbnail : "https://picsum.photos/200/300"
                )
              }
            >
              選擇此書筆記
            </AddButton>
            <BookDetail>
              <BookName>{book.title}</BookName>
              <BookAuthor>{book.authors}</BookAuthor>
              <BookPublish>{book.publishedDate}</BookPublish>
            </BookDetail>
          </CardContainer>
        );
      })}
    </AllCardsContainer>
  );
}
export default Card;
