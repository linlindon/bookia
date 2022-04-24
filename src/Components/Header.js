import styled from "styled-components";
import auth from "../utils/firebaseAuth";
import { NavLink } from "react-router-dom";

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  height: 60px;
  background-color: #dedede;
`;
const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const BarContent = styled.div``;
const NavLinks = styled(NavLink)`
  text-decoration: none;
  padding: 4px 6px;
  margin-right: 5px;
  font-size: 14px;
  color: black;
  background-color: #ffffff;
  border-radius: 5px;
`;
function Header(props) {
  return (
    <Navbar>
      <Logo>Bookia</Logo>
      <BarContent>
        <NavLinks to="/">筆記櫃</NavLinks>
        <NavLinks to="/alltags">書籤櫃</NavLinks>
        <NavLinks to="/search">新增筆記</NavLinks>
        <NavLinks to="/">站內搜尋</NavLinks>
        {props.loginState ? (
          <NavLinks to="login" onClick={auth.LogoutHandler}>
            登出
          </NavLinks>
        ) : (
          <NavLinks to="login">登入</NavLinks>
        )}
      </BarContent>
    </Navbar>
  );
}

export default Header;
