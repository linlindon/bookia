import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";

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
  align-self: end;
  margin-right: 100px;
  margin-top: 70px;
`;

export const LoginForm = (props) => {
  const [loginInfo, setLoginInfo] = useState({
    email: "test@gmail.com",
    password: "123456",
  });
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();

  async function login() {
    setIsLoading(true);
    if (loginInfo.email.trim() === "") {
      props.setHintTitle("請輸入電子信箱");
      props.setIsHint(true);
      return;
    }
    if (loginInfo.password.trim() === "") {
      props.setHintTitle("請輸入密碼");
      props.setIsHint(true);
      return;
    }
    await firebase
      .LoginHandler(loginInfo.email, loginInfo.password)
      .then(() => {
        setIsLoading(false);
        navigate("/library-search");
      })
      .catch((error) => {
        let message = tools.errorMessage(error);
        setIsLoading(false);
        if (message !== "") {
          props.setHintTitle(message);
          props.setIsHint(true);
          return;
        }
        props.setHintTitle("帳號或密碼錯誤，請重新嘗試");
        props.setIsHint(true);
      });
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        login();
      }}
    >
      <Title>Email</Title>
      <Input
        onChange={(e) =>
          setLoginInfo((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        defaultValue={"test@gmail.com"}
      />
      <Title>Password</Title>
      <Input
        name="password"
        onChange={(e) =>
          setLoginInfo((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
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

LoginForm.propTypes = {
  setHintTitle: PropTypes.func,
  setIsHint: PropTypes.func,
};
