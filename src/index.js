import ReactDOM from "react-dom";

import { GlobalStyle } from "./utils/style/globalStyles";
import { App } from "./App";

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById("root")
);
