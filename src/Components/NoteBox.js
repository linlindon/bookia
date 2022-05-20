import { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Edit } from "@styled-icons/fa-regular/Edit";

import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TagBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin-bottom: 20px;
  border: 1px solid #ece6e6;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 2px 2px 7px rgb(0 0 0 / 20%);
`;
const AddTagBox = styled(TagBox)`
  height: 80px;
  font-size: 16px;
  justify-content: center;
  color: #d3d2d1;
  border: 3px dashed #d3d2d1;
  cursor: pointer;

  &:hover {
    color: #404040;
    box-shadow: 3px 3px 3px rgba(0 0 0 / 30%);
  }
`;

const BoxNameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #d3d2d1;
`;
const NoteName = styled.h4`
  margin: 0;
  text-align: center;
  font-size: 16px;
`;
const NotePage = styled.div`
  font-size: 12px;
`;
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 80%;
  margin-bottom: 10px;
`;
const TagsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1em;
  margin-bottom: 10px;
`;
const Tag = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 15px;
  background-color: #e4d36d;
`;
const EditSignContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 15px;
  bottom: 10px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #fff;

  &:hover {
    box-shadow: 3px 3px 3px rgba(0 0 0 / 30%);
  }
`;

const EdditSign = styled(Edit)`
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #dca246;
`;

const Content = styled.div`
  margin-bottom: 10px;
`;

function NoteBox(props) {
  const userId = useContext(UserProfile);
  const parse = require("html-react-parser");
  async function updateNote(id) {
    await firebase.getNoteData(userId, id).then((data) => {
      props.setNoteData(data);
      props.setShowNoteInput(true);
    });
  }

  return (
    <>
      <Container>
        <AddTagBox onClick={props.showNoteInputHandler}>新增筆記</AddTagBox>
        {props.bookNotesData?.map((item) => (
          <TagBox key={item.content}>
            <BoxNameContainer>
              <NoteName>{item.title}</NoteName>
              <NotePage>頁數：{item.page}</NotePage>
            </BoxNameContainer>

            <ContentContainer>
              <TagsContainer>
                {item.tagNames.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagsContainer>
              <Content>{parse(item.content)}</Content>
              <EditSignContainer>
                <EdditSign onClick={() => updateNote(item.id)} title="修改" />
              </EditSignContainer>
            </ContentContainer>
          </TagBox>
        ))}
      </Container>
    </>
  );
}

NoteBox.propTypes = {
  bookNotesData: PropTypes.array,
  setShowNoteInput: PropTypes.func,
  setNoteData: PropTypes.func,
  showNoteInputHandler: PropTypes.func,
};

export default NoteBox;
