import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { UserProfile } from "../App";
import firebase from "../utils/firebaseTools";
import Book from "../components/Book";
import Loading from "../components/Loading";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  text-align: center;
`;
const HintTitle = styled.h3`
  font-size: 16px;
  margin-top: 5%;
  text-align: center;
`;

const LinkButton = styled.div`
  border: none;
  width: 150px;
  height: 35px;
  margin-right: 15px;
  letter-spacing: 2px;
  text-align: center;
  margin: 20px;
  padding: 3px 8px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => (props.active ? "#dca246" : "#e6c88b")};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

function Books() {
  const [bookDatas, setBookDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const userId = useContext(UserProfile);
  let navigate = useNavigate();

  useEffect(() => {
    let bookData = [];
    setIsLoading(true);
    if (userId) {
      firebase.getBooksData(userId).then((data) => {
        if (data.docs.length === 0) {
          setIsLoading(false);
          setIsHint(true);
        }
        data.docs.forEach((book) => {
          bookData.push(book.data());
        });
        setIsLoading(false);
        setBookDatas(bookData);
        // console.log(bookData);
      });
    }
  }, [userId]);

  return (
    <Wrapper>
      <Title>我的書櫃</Title>
      {isLoading && (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      )}
      {isHint && (
        <>
          <HintTitle>尚無書本</HintTitle>
          <LinkButton onClick={() => navigate(`/search`)}>
            前往圖書館新增書籍
          </LinkButton>
        </>
      )}
      {bookDatas.length !== 0 && <Book bookDatas={bookDatas} />}
    </Wrapper>
  );
}

export default Books;
