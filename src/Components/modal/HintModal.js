import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CloseSquareOutline } from "@styled-icons/evaicons-outline/CloseSquareOutline";

// import AddTagSign from "../AddTagSign";
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
const ModalTitle = styled.p`
  margin-bottom: 45px;
  font-size: 16px;
  font-weight: 600;
`;
const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 60%;
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

const ConfirmButton = styled.button`
  width: 120px;
  height: 35px;
  letter-spacing: 2px;
  text-align: center;
  margin: 0px 20px;
  padding: 3px 8px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #e6c88b;
  color: #fff;

  &:hover {
    background-color: #dca246;
  }
`;
const LoadingContainer = styled.div`
  position: absolute;
  width: 50px;
  margin-top: 80px;
`;
function HintModal(props) {
  const [isLoading, setIsLoading] = useState(false);
  const backgroundRef = useRef();

  function closeInput(e) {
    if (backgroundRef.current === e.target) {
      props.setIsHint(false);
    }
  }
  async function closeModals() {
    if (props.setShowNoteInput) {
      props.setShowNoteInput(false);
      props.setIsHint(false);
    } else if (props.deleteTagData.length !== 0) {
      setIsLoading(true);
      await props.deleteTagHandler(
        props.deleteTagData[0],
        props.deleteTagData[1]
      );
      setIsLoading(false);
      props.setIsHint(false);
    } else if (props.deleteGroupIndex) {
      setIsLoading(true);
      await props.deleteGroupHandler(props.deleteGroupIndex);
      setIsLoading(false);
      props.setIsHint(false);
    }
  }

  return (
    <Background ref={backgroundRef} onClick={closeInput}>
      <InputContainer>
        <Delete onClick={() => props.setIsHint(false)}>x</Delete>
        <ModalTitle>{props.hintTitle}</ModalTitle>
        {isLoading ? (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        ) : (
          <>
            {props.isConfirmClose ? (
              <div>
                <ConfirmButton onClick={closeModals}>是</ConfirmButton>
                <span> </span>
                <ConfirmButton onClick={() => props.setIsHint(false)}>
                  否
                </ConfirmButton>
              </div>
            ) : (
              <ConfirmButton
                onClick={() => {
                  props.setIsHint(false);
                  props.logoutRedirect && props.logoutRedirect();
                }}
              >
                確認
              </ConfirmButton>
            )}
          </>
        )}
      </InputContainer>
    </Background>
  );
}

HintModal.propTypes = {
  hintTitle: PropTypes.string,
  setIsHint: PropTypes.func,
  setShowNoteInput: PropTypes.func,
  isConfirmClose: PropTypes.bool,
  deleteTagData: PropTypes.array,
  deleteTagHandler: PropTypes.func,
  deleteGroupIndex: PropTypes.number,
  deleteGroupHandler: PropTypes.func,
};

export default HintModal;
