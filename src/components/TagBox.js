import { forwardRef } from "react";
import styled from "styled-components";
import { DeleteOutline } from "@styled-icons/typicons/DeleteOutline";
import { AddCircle } from "@styled-icons/ionicons-outline/AddCircle";
import PropTypes from "prop-types";

import Note from "./Note";
import GroupNameInput from "./GroupNameInput";

const BoxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;

  background-color: #f8f8f8;
  border-radius: 10px;
  margin-bottom: 40px;
  box-shadow: beige;
  box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);
  padding: 10px;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TagBoxContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: calc((100% - 105px) / 2);

  margin: 15px;
  padding: 10px;
  border-radius: 10px;
  border: solid 0.5px #e4e4e4;
  background-color: #ffffff;
  transition: 0.5s ease;

  &:hover {
    box-shadow: 2px 2px 7px rgb(0 0 0 / 30%);
  }

  @media only screen and (max-width: 768px) {
    width: 85%;
  }
`;
const AddTagBox = styled(TagBoxContainer)`
  padding: 7px;
  height: auto;
  color: #d3d2d1;
  border: 3px dashed #d3d2d1;
  cursor: pointer;
  flex-grow: 1;

  &:hover {
    color: #404040;
    box-shadow: 3px 3px 3px rgba(0 0 0 / 30%);
  }
`;
const BoxDeleteTag = styled(DeleteOutline)`
  display: none;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 28px;
  cursor: pointer;
  color: #d3d2d1;

  &:hover {
    color: #ff6972;
  }
  ${TagBoxContainer}:hover & {
    display: inline;
    z-index: 99;
  }
`;
const BoxNameDiv = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #ece6e6;
`;

const TagsContainer = styled.div`
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  width: 90%;
  gap: 1em;
  flex-grow: 1;
  margin-bottom: 20px;
`;

const Input = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const Tag = styled.div`
  margin: 0;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 15px;
  background-color: #eeeded;
  cursor: pointer;
  ${Input}:checked + && {
    background-color: #e4d36d;
    color: #fff;
  }
`;

const TagContainer = styled.label`
  display: flex;
  position: relative;
  align-items: flex-start;
`;
const AddSignContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 31px;
  height: 31px;
  border-radius: 16px;
  background-color: white;

  &:hover {
    box-shadow: 3px 3px 3px rgba(0 0 0 / 30%);
  }
`;

const AddSign = styled(AddCircle)`
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #dca246;

  @media only screen and (max-width: 768px) {
  }
`;
const TagsWrapper = styled.div`
  position: relative;
`;
const DeleteTag = styled(DeleteOutline)`
  display: none;
  position: absolute;
  top: -10px;
  right: -12px;
  width: 22px;
  margin-left: 6px;
  cursor: pointer;
  color: #d3d2d1;

  &:hover {
    color: #ff6972;
  }

  ${TagsWrapper}:hover & {
    display: inline;
    z-index: 99;
  }
`;
const NoDataContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;
const NoDataTitle = styled.h3`
  margin-top: 80px;
  font-size: 20px;
  font-weight: 900;
  text-align: center;
`;

const TagBox = forwardRef((props, ref) => {
  function showTagInputHandler(index) {
    props.setSelectedBoxIndex(index);
    props.setShowInputModal(true);
    props.setModalTitle("新書籤名稱");
  }

  async function choseTagHandler(tagName) {
    props.setNoDataHint(false);

    if (ref.current.includes(tagName)) {
      ref.current = ref.current.filter((item) => {
        return item !== tagName;
      });
    } else {
      ref.current.push(tagName);
    }
    props.getTagsNoteData();
  }

  function showGroupHintModal(name, index) {
    props.setIsHintTitle(`刪除「${name}」後，裡面的相關筆記標籤也將刪除`);
    props.setSelectedBoxIndex(index);
    props.setIsConfirmClose(true);
    props.setIsHint(true);
  }

  function showHintModal(tag, index) {
    props.setIsHintTitle(`刪除「${tag}」標籤後，所有筆記上的該標籤也將刪除`);
    props.setDeleteTagData([tag, index]);
    props.setIsConfirmClose(true);
    props.setIsHint(true);
  }

  return (
    <>
      <BoxWrapper>
        {props.groupData?.map((box, index) => (
          <TagBoxContainer key={box.name}>
            <BoxDeleteTag
              onClick={() => showGroupHintModal(box.name, index)}
              title="刪除書籤櫃"
            />
            <BoxNameDiv>
              <GroupNameInput
                name={box.name}
                groupData={props.groupData}
                boxIndex={index}
                setGroupData={props.setGroupData}
              />
            </BoxNameDiv>
            <TagsContainer>
              {box.tags?.map((tag) => (
                <TagsWrapper key={tag}>
                  <TagContainer htmlFor={tag}>
                    <Input id={tag}></Input>
                    <Tag onClick={() => choseTagHandler(tag)}>{tag}</Tag>
                  </TagContainer>
                  <DeleteTag onClick={() => showHintModal(tag, index)} />
                </TagsWrapper>
              ))}

              <AddSignContainer>
                <AddSign
                  onClick={() => showTagInputHandler(index)}
                  title="新增標籤"
                />
              </AddSignContainer>
            </TagsContainer>
          </TagBoxContainer>
        ))}
        <AddTagBox
          onClick={() => {
            props.setModalTitle("新書籤櫃名稱");
            props.setShowInputModal(true);
          }}
        >
          新增書籤櫃
        </AddTagBox>
      </BoxWrapper>

      {props.notesBoxData.length > 0 ? (
        <Note notesBoxData={props.notesBoxData} />
      ) : (
        <NoDataContainer>
          {props.noDataHint ? (
            <NoDataTitle>
              選取的書籤
              <br />
              無相關筆記
            </NoDataTitle>
          ) : (
            <NoDataTitle>
              點選書籤
              <br />
              顯示相關筆記
            </NoDataTitle>
          )}
        </NoDataContainer>
      )}
    </>
  );
});

TagBox.propTypes = {
  groupData: PropTypes.array,
  setGroupData: PropTypes.func,
  setShowInputModal: PropTypes.func,
  setModalTitle: PropTypes.func,
  setSelectedBoxIndex: PropTypes.func,
  setIsHint: PropTypes.func,
  setIsHintTitle: PropTypes.func,
  setIsConfirmClose: PropTypes.func,
  setDeleteTagData: PropTypes.func,
  getTagsNoteData: PropTypes.func,
  notesBoxData: PropTypes.array,
  setNoDataHint: PropTypes.func,
  noDataHint: PropTypes.bool,
  refProp: PropTypes.shape({ current: PropTypes.object }),
};

export default TagBox;
