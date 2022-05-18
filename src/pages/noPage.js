import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15%;
`;
const Button = styled(Link)`
  border: none;
  width: 150px;
  height: 35px;
  margin-top: 50px;
  letter-spacing: 2px;
  text-align: center;
  padding: 3px 8px;
  font-size: 16px;
  line-height: 2;
  border-radius: 5px;
  color: #fff;
  background-color: #e6c88b;

  &:hover {
    background-color: #dca246;
  }
`;

function NoPage() {
  return (
    <Container>
      <h1>此頁面不存在</h1>
      <Button to="/library-search">回到首頁</Button>
    </Container>
  );
}

export default NoPage;
