import { useRef, useState, useContext } from "react";
import styled from "styled-components";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";
import firebase from "../../utils/firebaseTools";
import tools from "../../utils/tools";
import { UserProfile } from "../../App";
import Loading from "../Loading";

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;
const InputContainer = styled.form`
  position: relative;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  width: 60%;
  height: 150px;
  background-color: white;
  border-radius: 10px;
  text-align: center;

  @media only screen and (min-width: 860px) {
    width: 600px;
  }
`;
const Delete = styled(CloseSquareOutline)`
  position: absolute;
  top: 5px;
  right: 10px;
  width: 20px;
  color: #ff6972;
`;
const ModalTitle = styled.p`
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 600;
`;
const ModalInput = styled.input`
  width: 45%;
  font-size: 16px;
`;
const Warning = styled.p`
  margin: 0;
  color: red;
`;
const LoadingContainer = styled.div`
  margin-top: 20px;
`;

let inputValue = "";
function InputModal(props) {
  const [isWarning, setIsWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  const inputRef = useRef();
  let allGroupData = [...props.groupData];

  async function addTagGroupHandler(e) {
    e.preventDefault();
    let allTags = tools.allTagsArray(allGroupData);
    let allTitles = tools.allGroupTitleArray(allGroupData);

    if (!inputValue) {
      return;
    } else {
      if (!props.selectedTagBoxName) {
        if (allTitles.includes(inputValue)) {
          setIsWarning(true);
        } else {
          setIsWarning(false);
          setIsLoading(true);
          allGroupData.push({ name: inputValue, tags: [] });

          await firebase.updateTagGroup(userId, allGroupData);

          props.setGroupData(allGroupData);
          props.setShowInputModal(false);
          inputValue = "";
          setIsLoading(false);
        }
      } else {
        if (allTags.includes(inputValue)) {
          setIsWarning(true);
        } else {
          setIsWarning(false);
          setIsLoading(true);
          allGroupData.forEach((tagBox) => {
            if (tagBox.name === props.selectedTagBoxName) {
              tagBox.tags.push(inputValue);
            } else {
              console.log("no match box name");
            }
          });

          await firebase.updateTagGroup(userId, allGroupData);
          props.setGroupData([...allGroupData]);
          setIsLoading(false);
          props.setShowInputModal(false);
        }
      }
    }
  }

  function closeInput(e) {
    if (inputRef.current === e.target) {
      props.setShowInputModal(false);
    }
  }
  return (
    <Background ref={inputRef} onClick={closeInput}>
      <InputContainer
        onSubmit={(e) => {
          addTagGroupHandler(e);
        }}
      >
        <Delete onClick={() => props.setShowInputModal(false)}>x</Delete>
        <ModalTitle>請輸入{props.modalTitle}</ModalTitle>
        <ModalInput
          onChange={(e) => (inputValue = e.target.value)}
          type="text"
        />
        {isWarning ? <Warning>此名稱已存在，請重新命名</Warning> : null}
        {isLoading && (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
      </InputContainer>
    </Background>
  );
}

export default InputModal;
