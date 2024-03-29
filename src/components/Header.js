import { useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Logout } from "@styled-icons/heroicons-outline/Logout";
import { Menu } from "@styled-icons/heroicons-outline/Menu";

import BookiaLogo from "../image/logo.png";
import LoadingModal from "../components/modal/LoadingModal";
import { Delete } from "../utils/style/commonStyles";

const PlaceHolder = styled.div`
  display: none;
  width: 100%;
  height: 60px;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const NavbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  align-items: center;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const LogoContainer = styled.div`
  width: 140px;
  margin-right: 5%;
  cursor: pointer;
`;

const Logo = styled.img.attrs({
  src: `${BookiaLogo}`,
})`
  width: 100%;
  object-fit: cover;
`;

const NavLinks = styled.div`
  width: 80%;

  .active {
    border-bottom: solid 3px #d3d2d1;
  }

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 20%;
    .active {
      border-bottom: solid 3px #dca246;
    }
  }
`;
const Nav = styled(NavLink)`
  padding: 4px 6px;
  margin-right: 2%;
  font-size: 16px;
  color: #363434;
  font-weight: 600;

  &:hover {
    color: #404040;
  }
  @media screen and (max-width: 768px) {
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    margin: 0 30px 20px;
  }
`;
const MobileLink = styled(NavLink)`
  display: none;

  .active {
    border-bottom: solid 3px #d3d2d1;
  }

  @media screen and (max-width: 768px) {
    display: block;
    padding: 4px 6px;
    margin-right: 2%;
    font-size: 16px;
    font-weight: 500;
    line-height: 27px;
    margin: 0 30px 20px;
    color: #fff;
    cursor: pointer;
  }
`;
const LogoutLink = styled.p`
  @media screen and (max-width: 768px) {
    display: block;
    padding: 4px 6px;
    margin-right: 2%;
    font-size: 16px;
    font-weight: 500;
    line-height: 27px;
    margin: 0 30px 20px;
    color: #fff;
    cursor: pointer;

    &:hover {
      color: #404040;
    }
  }
`;
const SignContainer = styled.div`
  position: relative;
  padding-bottom: 6px;
`;

const LogoutSign = styled(Logout)`
  posiiton: absolute;
  width: 24px;
  cursor: pointer;
`;
const LogoutHint = styled.div`
  position: absolute;
  left: -2vw;
  top: 30px;
  width: 50px;
  padding: 3px 8px;
  border-radius: 5px;
  text-align: center;
  background-color: #ffffff;
  font-weight: 500;
`;

////////漢堡選單/////////////
const HamburgerNav = styled.div`
  position: fixed;
  width: 100%;
  height: 68px;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  display: none;
  background-color: #f2f1f0;
  z-index: 9;

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;
const HamburgerBtn = styled(Menu)`
  position: absolute;
  left: 0px;
  width: 24px;
  margin: 0 32px;
  cursor: pointer;
`;

const SmallLogo = styled(Logo)`
  width: 100px;
  text-align: center;
  cursor: pointer;
`;
const MobileMenuOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileNavWrapper = styled.div`
  display: none;
  position: fixed;
  top: 0;
  width: 40%;
  height: 100vh;
  background-color: #e6c88b;
  z-index: 10;
  @media screen and (max-width: 768px) {
    display: block;
  }
  @media screen and (max-width: 426px) {
    width: 200px;
  }
`;

function Header(props) {
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowLogoutHint, setIsShowLogoutHint] = useState(false);
  const navigate = useNavigate();

  function closeToggleHandler(link) {
    setToggle(false);
    navigate(link);
  }

  async function logout() {
    setIsLoading(true);
    if (toggle) {
      setToggle(false);
    }
    props.logout();
  }

  return (
    <>
      <PlaceHolder />
      {isLoading && <LoadingModal />}
      <HamburgerNav>
        <HamburgerBtn src={Menu} onClick={() => setToggle(true)} />
        <SmallLogo
          onClick={() => navigate("/library-search")}
          alt="bookia logo"
        />
      </HamburgerNav>

      {toggle && (
        <>
          <MobileMenuOverlay />
          <MobileNavWrapper>
            <Delete onClick={closeToggleHandler} dependency={true} />
            <NavLinks>
              <MobileLink
                to="/library-search"
                onClick={() => closeToggleHandler("/library-search")}
              >
                圖書館
              </MobileLink>
              <MobileLink
                to="/books"
                onClick={() => closeToggleHandler("/books")}
              >
                我的筆記櫃
              </MobileLink>
              <MobileLink
                to="/tags"
                onClick={() => closeToggleHandler("/tags")}
              >
                我的書籤櫃
              </MobileLink>

              <MobileLink
                to="/site-search"
                onClick={() => closeToggleHandler("/site-search")}
              >
                我的搜尋
              </MobileLink>
              <LogoutLink onClick={logout}>登出</LogoutLink>
            </NavLinks>
          </MobileNavWrapper>
        </>
      )}

      <NavbarWrapper>
        <LogoContainer>
          <Logo onClick={() => navigate("/library-search")} alt="bookia logo" />
        </LogoContainer>
        <NavLinks>
          <Nav to="/library-search">圖書館</Nav>
          <Nav to="/books">我的書櫃</Nav>
          <Nav to="/tags">我的書籤櫃</Nav>
          <Nav to="/site-search">我的搜尋</Nav>
        </NavLinks>
        <SignContainer>
          <LogoutSign
            to="/login"
            onClick={logout}
            onMouseEnter={() => setIsShowLogoutHint(true)}
            onMouseLeave={() => setIsShowLogoutHint(false)}
          />
          {isShowLogoutHint && <LogoutHint>登出</LogoutHint>}
        </SignContainer>
      </NavbarWrapper>
      <Outlet />
    </>
  );
}

Header.propTypes = {
  logout: PropTypes.func,
};

export default Header;
