import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import tools from "../utils/tools";
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
  width: 46%;
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

export const LoginForm = (props) => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const regexs =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
    setIsLoading(true);
    if (!loginInfo.email) {
      props.setHintTitle("請輸入電子信箱");
      props.setIsHint(true);
    } else if (!regexs.test(loginInfo.email) || !loginInfo.email) {
      props.setHintTitle("字首請勿空格");
      props.setIsHint(true);
    } else {
      await firebase
        .LoginHandler(loginInfo.email, loginInfo.password)
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          navigate("/books");
        })
        .catch((error) => {
          console.log(error);
          let message = tools.errorMessage(error);
          setIsLoading(false);
          if (message !== "") {
            props.setHintTitle(message);
            props.setIsHint(true);
          } else {
            props.setHintTitle("帳號或密碼輸入錯誤");
            props.setIsHint(true);
          }
        });
    }
  }
  // defaultValue={"test@gmail.com"}
  // defaultValue={"123456"}
  return (
    <Form onSubmit={(e) => login(e)}>
      <Title>Email</Title>
      <Input
        name="email"
        onChange={inputHandler}
        defaultValue={"test@gmail.com"}
      />
      <Title>Password</Title>
      <Input
        name="password"
        onChange={inputHandler}
        type="password"
        defaultValue={"123456"}
      />
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
