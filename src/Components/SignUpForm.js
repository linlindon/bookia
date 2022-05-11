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

export const SignUpForm = () => {
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
    // 會在input的同時直接進行比較
    // if (signUpInfo.password !== signUpInfo.confirmPassword) {
    //   alert("您輸入的兩組密碼不相同，請重新輸入");
    // }
  };

  async function submitHandler(e) {
    e.preventDefault();
    if (!signUpInfo.name) {
      alert("請輸入姓名");
    } else if (signUpInfo.name.replace(/\s*/g, "").length === 0) {
      alert("字首請勿空格");
    } else if (!regexs.test(signUpInfo.email)) {
      alert("請輸入正確的email");
    } else if (signUpInfo.password !== signUpInfo.confirmPassword) {
      setSignUpInfo((prevState) => ({
        ...prevState,
        password: "",
        confirmPassword: "",
      }));
      alert("您輸入的兩組密碼不相同，請重新輸入");
    } else {
      setIsLoading(true);

      await firebase
        .SignUpHandler(signUpInfo.email, signUpInfo.password, signUpInfo.name)
        .then(() => {
          setIsLoading(false);
          navigate(`/books`);
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
