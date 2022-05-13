import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { DeleteOutline } from "@styled-icons/typicons/DeleteOutline";
import tools from "../utils/tools";

// const Input = styled.input``;

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

  ${
    "" /* background-color: ${(props) => (props.active ? "#dca246" : "#e6c88b")}; */
  }
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

  ${TagContainer}:hover & {
    display: inline;
    z-index: 99;
  }
`;

function TagList(props) {
  function showHintModal(tag, index) {
    console.log("delete tag");
    props.setIsHintTitle(`刪除「${tag}」標籤後，所有筆記上的該標籤也將刪除`);
    props.setDeleteTagData([tag, index]);
    props.setIsConfirmClose(true);
    props.setIsHint(true);
  }

  async function choseTagHandler(tagName) {
    console.log("chose");
    let currentClickTagNameArray = [];
    if (currentClickTagNameArray.includes(tagName)) {
      currentClickTagNameArray = currentClickTagNameArray.filter((item) => {
        return item !== tagName;
      });
    } else {
      currentClickTagNameArray.push(tagName);
    }
    props.setClickTagNameArray([...currentClickTagNameArray]);
    console.log(currentClickTagNameArray);
    // console.log(allNotesData);
  }

  return (
    <>
      {props.boxData.tags?.map((tag, index) => (
        <>
          <TagContainer htmlFor={tag} key={`box${tag}${index}`}>
            <Input id={tag}></Input>
            <Tag
              // active={searchType === "book"}
              onClick={() => {
                choseTagHandler(tag);
              }}
            >
              {tag}
            </Tag>
          </TagContainer>
          <DeleteTag
            onClick={() => {
              showHintModal(tag, props.boxIndex);
            }}
          />
        </>
      ))}
    </>
  );
}

export default TagList;
