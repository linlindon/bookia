import { useState } from "react";
import styled from "styled-components";

import image from "../image/login-book.jpg";
import BookiaLogo from "../image/logo.png";
import HintModal from "../components/modal/HintModal";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

const Container = styled.div`
  display: flex;
`;
const ImageContainer = styled.div`
  width: 50%;
  height: 100vh;

  @media only screen and (max-width: 785px) {
    display: none;
  }
`;
const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 785px) {
    display: none;
  }
`;
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  background-color: #f2f1f0;
  @media only screen and (max-width: 785px) {
    width: 100%;
    margin-top: 10vh;
  }
`;
const LogoContainer = styled.div`
  width: 140px;
  @media only screen and (max-width: 785px) {
    width: 120px;
  }
`;
const Subtitle = styled.p`
  margin-top: 0;
  font-size: 14px;
`;
const ButtonContainer = styled.div`
  display: flex;
  width: 40%;
  margin: 40px 0;
  justify-content: space-between;
`;
const Button = styled.button`
  border: none;
  width: 46%;
  height: 35px;
  letter-spacing: 2px;
  text-align: center;
  padding: 3px 8px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => (props.active ? "#dca246" : "#e6c88b")};
`;
const Logo = styled.img.attrs({
  src: `${BookiaLogo}`,
})`
  width: 100%;
  object-fit: cover;
`;

function Login() {
  const [type, setType] = useState("login");
  const [isHint, setIsHint] = useState(false);
  const [hintTitle, setHintTitle] = useState("");

  function typeHandler(type) {
    setType(type);
  }

  return (
    <>
      <Container>
        <ImageContainer>
          <Image src={image} alt="" />
        </ImageContainer>

        <LoginContainer>
          <LogoContainer>
            <Logo alt="bookia logo" />
          </LogoContainer>
          <Subtitle>book your idea</Subtitle>
          <ButtonContainer>
            <Button
              active={type === "login"}
              onClick={() => typeHandler("login")}
            >
              登入
            </Button>
            <Button
              active={type === "signUp"}
              onClick={() => typeHandler("signUp")}
              setHintTitle={hintTitle}
              setIsHint={setIsHint}
            >
              註冊
            </Button>
          </ButtonContainer>
          {type === "login" ? (
            <LoginForm setHintTitle={setHintTitle} setIsHint={setIsHint} />
          ) : (
            <SignUpForm setHintTitle={setHintTitle} setIsHint={setIsHint} />
          )}
        </LoginContainer>
      </Container>
      {isHint && <HintModal hintTitle={hintTitle} setIsHint={setIsHint} />}
    </>
  );
}

export default Login;
