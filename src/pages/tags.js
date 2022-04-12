import styled from "styled-components";
import TagBox from "../components/TagBox";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

function Tags() {
  return (
    <Container>
      <h1>書籤櫃</h1>
      <TagBox />
    </Container>
  );
}
export default Tags;
