import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { onSnapshot } from "firebase/firestore";
import { BookmarkOutlineAdd } from "@styled-icons/zondicons/BookmarkOutlineAdd";

import { UserProfile } from "../App";
import firebase from "../utils/firebaseTools";
import Book from "../components/Book";
import Loading from "../components/Loading";
import HintModal from "../components/modal/HintModal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const BooksContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 70%;
  max-width: 1280px;
  margin: 3% 15%;

  @media only screen and (max-width: 1280px) {
    margin: 2% 6%;
  }
  @media only screen and (max-width: 768px) {
    padding: 0 2%;
  }
`;
const TitleContainer = styled.div`
  position: relative;
`;
const Title = styled.h1`
  text-align: center;
`;
const AddSignContainer = styled.div`
  position: absolute;
  left: 34vw;
  bottom: 10px;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 2.5;
  border-radius: 16px;
  background-color: white;

  &:hover {
    box-shadow: 3px 3px 3px rgba(0 0 0 / 30%);
  }
  @media only screen and (max-width: 1280px) {
    left: 43vw;
  }
  @media only screen and (max-width: 426px) {
    right: 12px;
    bottom: 2px;
  }
`;
const AddSign = styled(BookmarkOutlineAdd)`
  margin-top: -3px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #dca246;
`;
const Hint = styled.div`
  position: absolute;
  width: max-content;
  padding: 5px;
  left: 30.5vw;
  border-radius: 5px;
  background-color: white;
  @media only screen and (max-width: 1280px) {
    left: 38.5vw;
  }
  @media only screen and (max-width: 900px) {
    left: 30vw;
    bottom: -20px;
  }
  @media only screen and (max-width: 426px) {
    display: none;
  }
`;

const HintTitle = styled.h3`
  font-size: 18px;
  margin-top: 5%;
  text-align: center;
`;

const LinkButton = styled.div`
  border: none;
  height: 35px;
  margin-right: 15px;
  letter-spacing: 2px;
  text-align: center;
  line-height: 2;
  margin: 20px;
  padding: 3px 8px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => (props.active ? "#dca246" : "#e6c88b")};
  cursor: pointer;
  &:hover {
    background-color: #dca246;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

function Books() {
  const [bookDatas, setBookDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignHint, setIsSignHint] = useState(false);
  const [isNoBookHint, setIsNoBookHint] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState("");
  const userId = useContext(UserProfile);
  let navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    if (userId) {
      let booksRef = firebase.getBooksRef(userId);
      const unsub = onSnapshot(booksRef, (books) => {
        const bookData = [];
        books.forEach((book) => {
          bookData.push(book.data());
        });

        if (bookData.length === 0) {
          setIsLoading(false);
          setIsNoBookHint(true);
        }
        setIsLoading(false);
        setBookDatas(bookData);
      });
      return unsub;
    }
  }, [userId]);

  async function deleteBook() {
    return await firebase.deleteBook(userId, deleteBookId);
  }

  return (
    <Wrapper>
      <TitleContainer>
        <>
          <Title>我的書櫃</Title>
          <AddSignContainer onClick={() => navigate("/library-search")}>
            <AddSign
              onMouseEnter={() => setIsSignHint(true)}
              onMouseLeave={() => setIsSignHint(false)}
            />
          </AddSignContainer>
          {isSignHint && <Hint>前往圖書館新增書籍</Hint>}
        </>
      </TitleContainer>
      {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}

      {isNoBookHint && (
        <>
          <HintTitle>尚無書本</HintTitle>
          <LinkButton onClick={() => navigate("/library-search")}>
            前往圖書館新增書籍
          </LinkButton>
        </>
      )}
      {bookDatas.length !== 0 && (
        <BooksContainer>
          <Book
            bookDatas={bookDatas}
            deleteBook={deleteBook}
            setIsHint={setIsHint}
            setDeleteBookId={setDeleteBookId}
          />
        </BooksContainer>
      )}
      {isHint && (
        <HintModal
          hintTitle={"確定要刪除此書嗎？"}
          setIsHint={setIsHint}
          deleteBook={deleteBook}
          deleteBookId={deleteBookId}
          isConfirmClose={true}
        />
      )}
    </Wrapper>
  );
}

export default Books;
