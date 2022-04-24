import { FieldValue } from "firebase/firestore";
import { useState } from "react";
import auth from "../utils/firebaseAuth";

export const SignUpForm = () => {
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
    // if (signUpInfo.password !== signUpInfo.confirmPassword) {
    //   alert("您輸入的兩組密碼不相同，請重新輸入");
    // }
  };

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
      <button
        onClick={() =>
          auth.SignUpHandler(
            signUpInfo.email,
            signUpInfo.password,
            signUpInfo.name
          )
        }
      >
        登入
      </button>
    </>
    // </form>
  );
};
