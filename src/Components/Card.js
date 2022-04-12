import react from "react";
import styled from "styled-components";

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

function Card() {
  const datas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <AllCardsContainer>
      {datas.map(() => (
        <CardContainer>
          <BookImageContainer>
            <BookImage src={require("../img/dress.png")} alt={"book photo"} />
          </BookImageContainer>
          <AddButton>選擇此書筆記</AddButton>
          <BookDetail>
            <BookName>書名</BookName>
            <BookAuthor>作者</BookAuthor>
            <BookPublish>出版年份</BookPublish>
          </BookDetail>
        </CardContainer>
      ))}
    </AllCardsContainer>
  );
}
export default Card;
