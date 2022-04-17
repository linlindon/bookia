import { getDocs } from "firebase/firestore";
import React from "react";
import styled from "styled-components";
import { tagsRef, notesRef } from "../utils/fireBaseConfig";
import Header from "../components/Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;
const Title = styled.h1``;

const NoteBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  width: 60%;
  margin-bottom: 20px;
  border: 2px solid #ece6e6;
  border-radius: 10px;
`;

const BookImg = styled.div`
  width: 120px;
  background-color: #66b2ff;
`;
const Img = styled.img`
  width: 100%;
  object-fit: cover;
`;
const ContentContainer = styled.div`
  width: 80%;
  padding: 20px;
`;

const BookTitle = styled.h3``;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
`;
const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;
const AddNoteSign = styled.div`
  width: 50px;
  height: 50px;
  font-size: 26px;
  border-radius: 25px;
  border: solid 1px black;
  line-height: 2;
`;

function Notes() {
  React.useEffect(() => {
    async function getNotesData() {
      try {
        // (await getDocs(notesRef)).forEach((doc) => {
        //   console.log(doc.data());
        // });
      } catch (err) {
        console.log("fetch failed", err);
      }
    }
    getNotesData();
  }, []);
  return (
    <>
      <Container>
        <Title>筆記櫃</Title>
        <NoteBox>
          <BookImg>
            <Img src="https://picsum.photos/200/300" alt="" />
          </BookImg>
          <ContentContainer>
            <BookTitle>書名: 瀕臨崩潰邊緣的人</BookTitle>
            <TagsContainer>
              <Tag>親情</Tag>
              <Tag>友情</Tag>
              <Tag>友情</Tag>
              <Tag>友情</Tag>
            </TagsContainer>
          </ContentContainer>
        </NoteBox>
      </Container>
      <AddNoteSign>+</AddNoteSign>
    </>
  );
}

export default Notes;
