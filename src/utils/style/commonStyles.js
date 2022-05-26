import styled from "styled-components";
import { AddCircle } from "@styled-icons/ionicons-outline/AddCircle";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";

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
  @media only screen and (max-width: 426px) {
    right: 12px;
    bottom: 2px;
  }
`;

const AddSign = styled(AddCircle)`
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: #dca246;
`;

const Delete = styled(CloseSquareOutline)`
  position: absolute;
  top: 5px;
  right: 10px;
  width: ${(props) => (props.dependency ? "24px" : "20px")};
  color: ${(props) => (props.dependency ? "#fff" : "#d3d2d1")};
  cursor: pointer;
  &:hover {
    color: #ff6972;
  }
`;

export { AddSignContainer, AddSign, Delete };
