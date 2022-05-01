import ReactDOM from "react-dom";
import ResetStyle from "./utils/globalStyle/resetStyles";
import GlobalStyle from "./utils/globalStyle/styles";

import "./index.css";
import { App } from "./App";

ReactDOM.render(
  <>
    <ResetStyle />
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);
