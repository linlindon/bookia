import { useRef, useState, useContext } from "react";
import styled from "styled-components";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";
import PropTypes from "prop-types";

import firebase from "../../utils/firebaseTools";
import tools from "../../utils/tools";
import Loading from "../Loading";
import { UserProfile } from "../../App";

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 60%;
  max-width: 600px;
  height: 180px;
  background-color: white;
  border-radius: 10px;

  @media only screen and (min-width: 860px) {
    width: 600px;
  }
`;
const Delete = styled(CloseSquareOutline)`
  position: absolute;
  top: 5px;
  right: 10px;
  width: 20px;
  color: #d3d2d1;
  cursor: pointer;
  &:hover {
    color: #ff6972;
  }
`;
const ModalTitle = styled.p`
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 600;
`;
const ModalInput = styled.input`
  width: 45%;
  background-color: white;
  font-size: 16px;
`;
const Warning = styled.p`
  margin: 0;
  height: 12px;
  color: #ff6972;
`;
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 35px;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  width: 120px;
  height: 35px;
  letter-spacing: 2px;
  text-align: center;
  margin-top: 20px;
  padding: 3px 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #e6c88b;
  color: #fff;

  &:hover {
    background-color: #dca246;
  }
  @media only screen and (max-width: 768px) {
    width: 20vw;
  }
`;

function InputModal(props) {
  const [isWarning, setIsWarning] = useState(false);
  const [warningContent, setWarningContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = useContext(UserProfile);
  const backgroundRef = useRef();
  const inputRef = useRef("");
  let allGroupData = [...props.groupData];

  async function addTagGroupHandler() {
    setIsWarning(false);
    let allTags = tools.allTagsArray(allGroupData);
    let allTitles = tools.allGroupTitleArray(allGroupData);

    if (
      !inputRef.current ||
      inputRef.current.replace(/\s*/g, "").length === 0
    ) {
      setWarningContent("請輸入名稱");
      setIsWarning(true);
      return;
    } else {
      if (props.selectedBoxIndex === undefined) {
        if (allTitles.includes(inputRef.current)) {
          setWarningContent("此名稱已存在，請輸入其他名稱");
          setIsWarning(true);
          return;
        }
        setIsWarning(false);
        setIsLoading(true);
        allGroupData.push({ name: inputRef.current, tags: [] });
        await firebase.updateTagGroup(userId, allGroupData);
        props.setGroupData(allGroupData);
        inputRef.current = "";
        props.setShowInputModal(false);
        setIsLoading(false);
      } else {
        if (allTags.includes(inputRef.current)) {
          setWarningContent("此名稱已存在，請輸入其他名稱");
          setIsWarning(true);
          props.setSelectedBoxIndex(undefined);
          return;
        }
        setIsWarning(false);
        setIsLoading(true);

        allGroupData[props.selectedBoxIndex].tags.push(inputRef.current);

        await firebase.updateTagGroup(userId, allGroupData);
        props.setGroupData([...allGroupData]);
        setIsLoading(false);
        props.setSelectedBoxIndex(undefined);
        props.setShowInputModal(false);
      }
    }
  }

  function closeInput(e) {
    if (backgroundRef.current === e.target) {
      props.setShowInputModal(false);
    }
  }
  return (
    <Background ref={backgroundRef} onClick={closeInput}>
      <InputContainer
        onSubmit={(e) => {
          e.preventDefault();
          addTagGroupHandler();
        }}
      >
        <Delete onClick={() => props.setShowInputModal(false)}>x</Delete>
        <ModalTitle>請輸入{props.modalTitle}</ModalTitle>
        <ModalInput
          onChange={(e) => (inputRef.current = e.target.value)}
          type="text"
        />
        {isWarning ? <Warning>{warningContent}</Warning> : <Warning />}

        {isLoading ? (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        ) : (
          <ConfirmButton>確認</ConfirmButton>
        )}
      </InputContainer>
    </Background>
  );
}

InputModal.propsTypes = {
  groupData: PropTypes.array,
  setGroupData: PropTypes.func,
  setShowInputModal: PropTypes.func,
  modalTitle: PropTypes.string,
  selectedBoxIndex: PropTypes.string,
  setSelectedBoxIndex: PropTypes.func,
};

export default InputModal;
