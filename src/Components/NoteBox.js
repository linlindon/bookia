import React from "react";
import styled from "styled-components";

const BoxName = styled.h4`
  width: 80%;
  padding-bottom: 10px;
  text-align: center;
  font-size: 16px;
  border-bottom: 2px solid #ece6e6;
`;
const BookName = styled.div`
  display: block;
  margin-bottom: 5px;
`;
const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  gap: 1em;
`;
const AddSign = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: solid 1px black;
  line-height: 2.5;
`;
const Tag = styled.p`
  padding: 4px 6px;
  font-size: 14px;
  border: 1px solid #ffb226;
  border-radius: 5px;
`;
const TagBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  border: 1px solid #ece6e6;
  border-radius: 10px;
`;

function NoteBox(props) {
  console.log("NoteBox");
  return (
    <>
      {props.bookNotesData?.map((item) => (
        <TagBox>
          <BoxName>{item.title}</BoxName>
          <BookName>書名：{item.bookTitle}</BookName>
          <BookName>頁數：{item.page}</BookName>

          <TagsContainer>
            {item.tagNames.map((tag) => {
              <Tag>
                {tag}
                <deleteSign>x</deleteSign>
              </Tag>;
            })}
            <p>{item.content}</p>
            <AddSign>修改</AddSign>
          </TagsContainer>
        </TagBox>
      ))}
    </>
  );
}

export default NoteBox;
