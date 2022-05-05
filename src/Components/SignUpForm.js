import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import Loading from "./Loading";

const LoadingContainer = styled.div`
  margin-top: 30px;
`;

export const SignUpForm = () => {
  let navigate = useNavigate();
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
    setIsLoading(true);
    console.log("sign up ");
    await firebase
      .SignUpHandler(signUpInfo.email, signUpInfo.password, signUpInfo.name)
      .then(() => {
        setIsLoading(false);
        navigate(`/books`);
      });
  }
  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <div>
        <p>Name</p>
        <input name="name" onChange={inputHandler} />
        <p>Email</p>
        <input name="email" onChange={inputHandler} />
        <p>Password</p>
        <input name="password" onChange={inputHandler} />
        <p>Confirm Password</p>
        <input name="confirmPassword" />
      </div>

      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <button onSubmit={submitHandler}>確認</button>
      )}
    </form>
  );
};
