import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import Loading from "./Loading";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 415px;
`;
const Title = styled.h4`
  nargin: 0;
  font-weight: 500;
`;
const Input = styled.input`
  font-size: 16px;
`;

const Button = styled.button`
  border: none;
  width: 150px;
  height: 35px;
  margin-top: 60px;
  padding: 3px 8px;
  align-self: end;
  letter-spacing: 2px;
  text-align: center;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: #e6c88b;

  &:hover {
    background-color: #dca246;
  }
`;
const LoadingContainer = styled.div`
  margin-top: 30px;
`;

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  const inputHandler = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  async function login(e) {
    e.preventDefault();
    console.log("submit");
    setIsLoading(true);
    console.log("login func");
    await firebase
      .LoginHandler(loginInfo.email, loginInfo.password)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        navigate("/books");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <Form onSubmit={(e) => login(e)}>
      <Title>Email</Title>
      <Input name="email" onChange={inputHandler} />
      <Title>Password</Title>
      <Input name="password" onChange={inputHandler} type="password" />
      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <Button>登入</Button>
      )}
    </Form>
  );
};

// export const showLoginError = (error) => {
//   if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
//     lblLoginErrorMessage.innerHTML = "Wrong password, try again.";
//   } else {
//     lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;
//   }
// };

// export const showLoginState = (user) => {
//   lblAuthState.innerHTML = `you logged in as ${user.displayName} (${user.uid})`;
// };
