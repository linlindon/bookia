import { serverTimestamp } from "firebase/firestore";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";
import image from "../img/book.png";

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
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  width: calc((100% - 84px) / 2);
  margin: 30px 20px;
  border-radius: 10px;
  border: solid 0.5px #e4e4e4;
  background-color: #ffffff;
  ${"" /* outline: 1px none transparent; */}
  transition: 0.5s ease;

  &:hover {
    box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);
    background-color: #eeeded;
  }
`;

const BookImageContainer = styled.div`
  width: 185px;
  overflow: hidden;
  ${"" /* height: 250px; */}
  margin: 32px 15px;
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
  margin-top: 10px;
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
  margin: 23px 0px;
  font-size: 16px;
  font-weight: 500;
`;

const BookName = styled.h3`
  margin: 6px;
`;
const BookAuthor = styled.p`
  margin: 5px;
`;
const BookPublish = styled(BookAuthor)``;

function Card(props) {
  let navigate = useNavigate();
  const userId = useContext(UserProfile);
  console.log("card");
  async function getBookData(book, title, authors, publisher, date, img) {
    console.log(book);
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

    await firebase.addNewBook(userId, newBookId, data);
    navigate(`/booknote/${newBookId}`, { state: data });
  }

  return (
    // <Wrapper>
    <AllCardsContainer>
      {props.bookList?.map((book, index) => {
        let img = book.imageLinks;
        return (
          <CardContainer key={book}>
            <BookImageContainer key={book.imageLinks}>
              <BookImage key={image} src={img ? img.smallThumbnail : image} />
            </BookImageContainer>

            <BookDetail key={`${index}${book}`}>
              <div>
                <BookName key={book.title}>{book.title}</BookName>
                <BookAuthor key={book.authors}>
                  {book.authors && book.authors.join("、")}
                </BookAuthor>
                <BookPublish key={book.publishedDate}>
                  {book.publishedDate}
                </BookPublish>
                <BookPublish key={book.publisher}>{book.publisher}</BookPublish>
              </div>

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
                選擇此書筆記
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
