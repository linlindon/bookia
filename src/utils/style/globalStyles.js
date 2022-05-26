import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

    body {
        margin: 0;
        line-height: 1.5;
        background-color: #f2f1f0;
        box-sizing: border-box;
        letter-spacing: .1rem;
        color: #404040;
        font-size: 14px;
        font-family: 'Noto Sans TC', sans-serif; 


        @media only screen and (max-width: 768px) {
            font-size: 14px;
        }
    }
    p {
        margin-top: 0;
    }
    button {
        border: none;
        cursor: pointer;
    }

    input {
        -webkit-appearance:none; 
        -webkit-box-shadow: 0 0 0 0px #ffffff inset;
        border: none;
        height: 18px;
        border-bottom: solid 1px black;
        font-size: 14px;
        font-family: 'Noto Sans TC', serif; 
        color: #404040;
        background-color: #f2f1f0;
    }

    textarea {
        font-size: 14px;
        padding: 8px;
    }
    input:focus {
        outline: none;
    }
    a, a:hover, a:focus, a:active {
      text-decoration: none;
      color: inherit;
    }
    h1 {
        @media only screen and (max-width: 426px) {
            font-size: 1.5em;
        } 
    }
`;
