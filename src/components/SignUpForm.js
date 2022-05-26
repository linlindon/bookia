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
  align-self: end;
  margin-right: 100px;
  margin-top: 70px;
`;

export const SignUpForm = (props) => {
  let navigate = useNavigate();
  const regexs =
    // eslint-disable-next-line
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function submitHandler() {
    if (signUpInfo.name.trim() === "") {
      props.setHintTitle("請輸入姓名");
      props.setIsHint(true);
      return;
    }
    if (!regexs.test(signUpInfo.email) || signUpInfo.email.trim() === "") {
      props.setHintTitle("請輸入正確的email");
      props.setIsHint(true);
      return;
    }
    if (
      signUpInfo.password.trim() === "" ||
      signUpInfo.confirmPassword.trim() === ""
    ) {
      props.setHintTitle("請輸入密碼");
      props.setIsHint(true);
      return;
    }
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      props.setHintTitle("您輸入的兩組密碼不相同，請重新輸入");
      props.setIsHint(true);
      return;
    }

    setIsLoading(true);
    await firebase
      .SignUpHandler(signUpInfo.email, signUpInfo.password, signUpInfo.name)
      .then(() => {
        setIsLoading(false);
        navigate(`/library-search`);
      })
      .catch((error) => {
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

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
    >
      <Title>Name</Title>
      <Input
        onChange={(e) =>
          setSignUpInfo((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        value={signUpInfo.name}
      />
      <Title>Email</Title>
      <Input
        onChange={(e) =>
          setSignUpInfo((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        value={signUpInfo.email}
      />
      <Title>Password</Title>
      <Input
        name="password"
        onChange={(e) =>
          setSignUpInfo((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
        type="password"
        value={signUpInfo.password}
      />
      <Title>Confirm Password</Title>
      <Input
        type="password"
        onChange={(e) =>
          setSignUpInfo((prev) => ({
            ...prev,
            confirmPassword: e.target.value,
          }))
        }
        value={signUpInfo.confirmPassword}
      />

      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <Button>註冊</Button>
      )}
    </Form>
  );
};

SignUpForm.propTypes = {
  setHintTitle: PropTypes.func,
  setIsHint: PropTypes.func,
};
