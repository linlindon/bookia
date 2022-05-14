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
  letter-spacing: 2px;
  text-align: center;
  padding: 3px 8px;
  align-self: end;
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

export const SignUpForm = (props) => {
  let navigate = useNavigate();
  const regexs =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setSignUpInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function submitHandler(e) {
    e.preventDefault();
    console.log("submit");
    if (!signUpInfo.name) {
      props.setHintTitle("請輸入姓名");
      props.setIsHint(true);
    } else if (signUpInfo.name.replace(/\s*/g, "").length === 0) {
      props.setHintTitle("字首請勿空格");
      props.setIsHint(true);
    } else if (!regexs.test(signUpInfo.email) || !signUpInfo.email) {
      props.setHintTitle("請輸入正確的email");
      props.setIsHint(true);
    } else if (!signUpInfo.password || !signUpInfo.confirmPassword) {
      props.setHintTitle("請輸入密碼");
      props.setIsHint(true);
    } else if (signUpInfo.password !== signUpInfo.confirmPassword) {
      props.setHintTitle("您輸入的兩組密碼不相同，請重新輸入");
      props.setIsHint(true);
      setSignUpInfo((prevState) => ({
        ...prevState,
        password: "",
        confirmPassword: "",
      }));
    } else {
      setIsLoading(true);
      await firebase
        .SignUpHandler(signUpInfo.email, signUpInfo.password, signUpInfo.name)
        .then(() => {
          setIsLoading(false);
          navigate(`/library-search`);
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
  return (
    <Form onSubmit={(e) => submitHandler(e)}>
      <Title>Name</Title>
      <Input name="name" onChange={inputHandler} value={signUpInfo.name} />
      <Title>Email</Title>
      <Input name="email" onChange={inputHandler} value={signUpInfo.email} />
      <Title>Password</Title>
      <Input
        name="password"
        onChange={inputHandler}
        type="password"
        value={signUpInfo.password}
      />
      <Title>Confirm Password</Title>
      <Input
        name="confirmPassword"
        type="password"
        onChange={inputHandler}
        value={signUpInfo.confirmPassword}
      />

      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <Button onSubmit={submitHandler}>註冊</Button>
      )}
    </Form>
  );
};
