import { useState } from "react";
import auth from "../utils/firebaseAuth";

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    // <form>
    <>
      <div>
        <p>Email</p>
        <input name="email" onChange={inputHandler} />
        <p>Password</p>
        <input name="password" onChange={inputHandler} />
      </div>
      <button
        onClick={() => auth.LoginHandler(loginInfo.email, loginInfo.password)}
      >
        登入
      </button>
    </>
    // </form>
  );
};
