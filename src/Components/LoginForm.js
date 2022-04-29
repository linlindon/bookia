import { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../utils/firebaseTools";

export const LoginForm = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  async function login(e) {
    e.preventDefault();
    console.log("login func");
    await firebase
      .LoginHandler(loginInfo.email, loginInfo.password)
      .then((res) => {
        console.log(res);
        navigate("/books");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <form onSubmit={(e) => login(e)}>
      <div>
        <p>Email</p>
        <input name="email" onChange={inputHandler} />
        <p>Password</p>
        <input name="password" onChange={inputHandler} />
      </div>
      <button onSubmit={login}>登入</button>
    </form>
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
