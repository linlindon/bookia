import { serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";

const AllCardsContainer = styled.div`
  display: flex;
  width: 100%;
  ${"" /* justify-content: center; */}
  flex-wrap: wrap;
  margin: 30px 5% 40px 5%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc((100%-120px) / 3);
  margin: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);

  &:hover {
    transform: scale(1.1);
    background-color: #3fccdc;
  }
`;

const BookImageContainer = styled.div`
  width: 150px;
  height: 220px;
  border: solid 1px #f2f1f0;
`;
const BookImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const AddButton = styled.button`
  border: none;
  margin-top: 10px;
  padding: 3px 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #3fccdc;

  ${CardContainer}:hover & {
    background-color: #ffffff;
  }
`;
const BookDetail = styled.div`
  text-align: center;
`;

const BookName = styled.h3`
  margin: 6px;
  font-size: 16px;
`;
const BookAuthor = styled.p`
  margin: 5px;
`;
const BookPublish = styled(BookAuthor)``;

function Card(props) {
  let navigate = useNavigate();
  const userId = useContext(UserProfile);

  async function getBookData(book, title, authors, date, img) {
    if (date === undefined) {
      date = "無資料";
    } else if (authors === undefined) {
      authors = ["無資料"];
    }
    let data = {
      title: title,
      authors: authors,
      publish: date,
      img: img,
      id: "",
      tagNames: [],
      time: serverTimestamp(),
    };
    console.log(data);
    const newBookId = firebase.setNewBookRef(userId);

    await firebase.addNewBook(userId, newBookId, data);
    navigate(`/booknote/${newBookId}`, { state: data });
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
              <BookAuthor>{book.authors && book.authors.join("、")}</BookAuthor>
              <BookPublish>{book.publishedDate}</BookPublish>
            </BookDetail>
          </CardContainer>
        );
      })}
    </AllCardsContainer>
  );
}
export default Card;
