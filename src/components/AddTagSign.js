import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-solid/AddCircle";

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

  @media only screen and (max-width: 786px) {
    top: 90px;
  }
`;

function AddTagSign() {
  return (
    <AddSignContainer>
      <AddSign />
    </AddSignContainer>
  );
}

export default AddTagSign;
