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

  ${
    "" /* margin: 30px 5% 40px 5%;
  @media only screen and (min-width: 1280px) {
    width: 1280px;
  } */
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  width: calc((100% - 84px) / 2);
  margin: 30px 20px;
  border-radius: 10px;
  border: solid 0.5px #e4e4e4;
  outline: 1px none transparent;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease,
    outline 0.3s ease;

  &:hover {
    box-shadow: 2px 2px 7px rgb(0 0 0 / 20%);
    background-color: #e4e4e4;
  }
`;

// const CardContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: calc((100% - 120px) / 3);
//   margin: 10px;
//   padding: 10px 10px;
//   border-radius: 10px;
//   background-color: #ffffff;
//   box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);

//   @media only screen and (min-width: 1280px) {
//     width: calc((100% - 160px) / 4);
//   }
//   @media only screen and (max-width: 786px) {
//     width: calc((100% - 80px) / 2);
//   }
//   @media only screen and (max-width: 600px) {
//     width: 80%;
//   }

//   &:hover {
//     transform: scale(1.05);
//     background-color: #3fccdc;
//   }
// `;

const BookImageContainer = styled.div`
  flex: none;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  width: 185px;
  margin: 22px 15px;
  background-color: white;

  ${
    "" /* width: 150px;
  height: 200px;
  border: solid 1px #f2f1f0; */
  }
`;
const BookImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  margin: 30px 0px;
  ${
    "" /* flex-basis: 0;
  flex-grow: 1;
  max-width: 100%; */
  }
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
              <BookImage key={image} src={img ? img.thumbnail : image} />
            </BookImageContainer>

            <BookDetail key={`${index}book`}>
              <div>
                <BookName key={book.title}>{book.title}</BookName>
                <BookAuthor key={book.authors}>
                  {book.authors && book.authors.join("、")}
                </BookAuthor>
                <BookPublish key={book.publisher}>{book.publisher}</BookPublish>
                <BookPublish key={book.publishedDate}>
                  {book.publishedDate}
                </BookPublish>
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
