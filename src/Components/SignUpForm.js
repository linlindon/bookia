import { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../utils/firebaseTools";

export const SignUpForm = () => {
  let navigate = useNavigate();
  const [signUpInfo, setSignUpInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  function submitHandler() {
    console.log("submit");
    auth.SignUpHandler(signUpInfo.email, signUpInfo.password, signUpInfo.name);
    navigate(`/`);
  }
  return (
    // <form>
    <>
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
      <button onClick={submitHandler}>登入</button>
    </>
    // </form>
  );
};
