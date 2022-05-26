import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Delete } from "../../utils/style/commonStyles";
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
  max-width: 600px;
  height: 180px;
  background-color: white;
  border-radius: 10px;

  @media only screen and (max-width: 768px) {
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
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
  @media only screen and (max-width: 768px) {
    width: 20vw;
    margin: 0 10px;
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
      return;
    }
    if (props.deleteTagData.length !== 0) {
      setIsLoading(true);
      await props.deleteTagHandler(
        props.deleteTagData[0],
        props.deleteTagData[1]
      );
      setIsLoading(false);
      props.setIsHint(false);
      return;
    }
    setIsLoading(true);
    await props.deleteGroupHandler(props.selectedBoxIndex);
    setIsLoading(false);
    props.setIsHint(false);
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
              <ButtonContainer>
                <ConfirmButton onClick={closeModals}>是</ConfirmButton>

                <ConfirmButton onClick={() => props.setIsHint(false)}>
                  否
                </ConfirmButton>
              </ButtonContainer>
            ) : (
              <ConfirmButton
                onClick={() => {
                  props.setIsHint(false);
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
  setSelectedBoxIndex: PropTypes.number,
  deleteGroupHandler: PropTypes.func,
};

export default HintModal;
