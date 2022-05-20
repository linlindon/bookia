import { useState, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";

const BoxName = styled.div`
  margin: 8px;
  height: 22px;
  letter-spacing: 2px;
`;
const NameInput = styled.input`
  border: none;
  height: 20px;
  margin-top: 8px;
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
  background-color: #eeeded;
  border: 1px solid #404040;
  border-radius: 5px;
`;

function GroupNameInput(props) {
  const [isUpdateTagBoxName, setIsUpdateTagBoxName] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const userId = useContext(UserProfile);

  async function submitHandler(index) {
    let currentGroupData = [...props.groupData];
    if (!inputValue) {
      setIsUpdateTagBoxName(false);
      return;
    }
    if (inputValue.replace(/\s*/g, "").length === 0) {
      setIsUpdateTagBoxName(false);
      return;
    }
    currentGroupData[index].name = inputValue;

    await firebase.updateTagGroup(userId, currentGroupData);
    props.setGroupData(currentGroupData);
    setIsUpdateTagBoxName(false);
  }
  return (
    <>
      {isUpdateTagBoxName ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler(props.boxIndex);
          }}
        >
          <NameInput
            autoFocus
            defaultValue={props.name}
            as="input"
            onBlur={() => {
              submitHandler(props.boxIndex);
            }}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
      ) : (
        <BoxName onClick={() => setIsUpdateTagBoxName(true)}>
          {props.name}
        </BoxName>
      )}
    </>
  );
}

GroupNameInput.propTypes = {
  groupData: PropTypes.array,
  setGroupData: PropTypes.func,
  name: PropTypes.string,
  boxIndex: PropTypes.number,
};

export default GroupNameInput;
