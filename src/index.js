import ReactDOM from "react-dom";

import { GlobalStyle } from "./utils/globalStyle/styles";
import { App } from "./App";

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);
