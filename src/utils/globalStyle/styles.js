import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

    body {
        line-height: 1.5;
        background-color: #f2f1f0;
        -webkit-appearance:none;
    }

    button {
        
        cursor: pointer;
    }

    input {
        border: none;
        border-bottom: solid 1px black;
        font-size: 14px;
    }
    input:focus {
        outline: none;
    }
`;

export default GlobalStyle;
