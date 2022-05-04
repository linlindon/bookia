import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

    body {
        line-height: 1.5;
        background-color: #f2f1f0;
        box-sizing: border-box;
        letter-spacing: .1rem;
        color: #363434;
        font-family: 'Noto Serif TC', serif;
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
        color: #363434;
    }
    input:focus {
        outline: none;
    }
`;

// export const MediaQuerySmall = `@media only screen and {max-width: 768px}`;
// export const MediaQueryLarge = `@media only screen and {min-width: 1280px}`;

// export { GlobalStyle };
