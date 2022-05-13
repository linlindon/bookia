import { useState, useContext } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { UserProfile } from "../App";

const BoxName = styled.div`
  margin: 8px;
  height: 22px;
  letter-spacing: 2px;
`;
const NameInput = styled.input`
  border: none;
  height: 22px;
  margin-top: 6px;
  margin-bottom: 9px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
  background-color: #eeeded;
`;
const Form = styled.form``;

function BoxNameInput(props) {
  const [isUpdateTagBoxName, setIsUpdateTagBoxName] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const userId = useContext(UserProfile);

  //   if (inputRef.current === e.target)
  console.log("box name input");
  async function submitHandler(index, e) {
    e.preventDefault();
    console.log(index, inputValue);
    let currentGroupData = [...props.groupData];

    if (!inputValue) {
      console.log("no value");
      setIsUpdateTagBoxName(false);
      return;
    } else if (inputValue.replace(/\s*/g, "").length === 0) {
      console.log("no value2");
      setIsUpdateTagBoxName(false);
      return;
    } else if (inputValue === "") {
      setIsUpdateTagBoxName(false);
      return;
    } else {
      currentGroupData[index].name = inputValue;
      props.setGroupData(currentGroupData);
      // await firebase.updateTagGroup(userId, currentGroupData);
      setIsUpdateTagBoxName(false);
    }
  }
  return (
    <>
      {isUpdateTagBoxName ? (
        <Form onSubmit={(e) => submitHandler(props.boxIndex, e)}>
          <NameInput
            autoFocus
            defaultValue={props.name}
            as="input"
            onBlur={(e) => submitHandler(props.boxIndex, e)}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </Form>
      ) : (
        <BoxName onClick={() => setIsUpdateTagBoxName(true)}>
          {props.name}
        </BoxName>
      )}
    </>
  );
}

export default BoxNameInput;
