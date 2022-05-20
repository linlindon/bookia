import styled, { keyframes } from "styled-components";

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
const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 15px }
  100% { margin-bottom: 0 }
`;
const DotWrapper = styled.div`
  position: absolute;
  display: flex;
  width: 60px;
  margin: 0 auto;
  align-items: flex-end;
  z-index: 999;
`;

const Dot = styled.div`
  background-color: #dca246;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin: 0 5px;

  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${(props) => props.delay};
`;

function LoadingModal() {
  return (
    <Background>
      <DotWrapper>
        <Dot delay="0s" />
        <Dot delay=".1s" />
        <Dot delay=".2s" />
      </DotWrapper>
    </Background>
  );
}

export default LoadingModal;
