import { useEffect, useState } from "react";
import styled from "styled-components";
import image from "../img/book.jpg";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

const Container = styled.div`
  display: flex;
`;
const ImageContainer = styled.div`
  width: 50%;
  height: 100%;
`;
const Image = styled.img`
  object-fit: cover;
  width: 100%;
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
`;

function Login() {
  const [memberState, setMemberState] = useState(true);

  return (
    <>
      <Container>
        <ImageContainer>
          <Image src={image} alt="" />
        </ImageContainer>

        <LoginContainer>
          <h1>Bookia</h1>
          <h2>book your idea</h2>
          <div>
            <button onClick={() => setMemberState(false)}>註冊</button>
            <button onClick={() => setMemberState(true)}>登入</button>
          </div>
          {memberState ? <LoginForm /> : <SignUpForm />}
        </LoginContainer>
      </Container>
    </>
  );
}

export default Login;
