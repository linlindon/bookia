import styled, { keyframes } from "styled-components";

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
  background-color: #41c9d8;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin: 0 5px;
  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${(props) => props.delay};
`;

function Loading() {
  return (
    <DotWrapper>
      <Dot delay="0s" />
      <Dot delay=".1s" />
      <Dot delay=".2s" />
    </DotWrapper>
  );
}

export default Loading;
