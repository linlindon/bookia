import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

    body {
        line-height: 1.5;
        background-color: #f2f1f0;
        box-sizing: border-box;
        letter-spacing: .1rem;
        color: #404040;
        font-family: 'Noto Serif TC', serif;
        font-size: 14px;
        ${"" /* font-family: 'Noto Sans TC', sans-serif; */}


        @media only screen and (max-width: 786px) {
            font-size: 14px;
        }
    }

    button {
        
        cursor: pointer;
    }

    input {
        -webkit-appearance:none; 
        border: none;
        border-bottom: solid 1px black;
        font-size: 14px;
        font-family: 'Noto Serif TC', serif;
        color: #404040;
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
`;

// export const MediaQuerySmall = `@media only screen and {max-width: 768px}`;
// export const MediaQueryLarge = `@media only screen and {min-width: 1280px}`;

// export { GlobalStyle };
