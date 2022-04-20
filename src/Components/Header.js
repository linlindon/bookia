import styled from "styled-components";
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
const Link = styled(NavLink)`
  text-decoration: none;
  padding: 4px 6px;
  margin-right: 5px;
  font-size: 14px;
  color: black;
  background-color: #ffffff;
  border-radius: 5px;
`;
function Header() {
  return (
    <Navbar>
      <Logo>Bookia</Logo>
      <BarContent>
        <Link to="/">筆記櫃</Link>
        <Link to="/alltags">書籤櫃</Link>
        <Link to="/search">新增筆記</Link>
        <Link to="/">站內搜尋</Link>
      </BarContent>
    </Navbar>
  );
}

export default Header;
