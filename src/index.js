import ReactDOM from "react-dom";
import ResetStyle from "./utils/resetStyles";

import "./index.css";
import { App } from "./App";

ReactDOM.render(
  <>
    <ResetStyle />
    <App />
  </>,
  document.getElementById("root")
);
