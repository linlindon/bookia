import { useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import { Logout } from "@styled-icons/heroicons-outline/Logout";
import { Menu } from "@styled-icons/heroicons-outline/Menu";

import BookiaLogo from "../image/logo.png";
import firebase from "../utils/firebaseTools";
import HintModal from "./modal/HintModal";
import LoadingModal from "../components/modal/LoadingModal";

const PlaceHolder = styled.div`
  width: 100%;
  height: 60px;

  @media screen and (min-width: 787px) {
    display: none;
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
    width: 80%;
    margin-top: 20%;
  }
`;
const Nav = styled(NavLink)`
  padding: 4px 6px;
  margin-right: 2%;
  font-size: 16px;
  color: #363434;
  font-weight: 600;

  &:hover {
    color: #000;
  }
  @media screen and (max-width: 768px) {
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    margin: 0 30px 20px;
  }
`;
const MobileLink = styled.p`
  @media screen and (max-width: 768px) {
    padding: 4px 6px;
    margin-right: 2%;
    font-weight: 500;
    line-height: 27px;
    margin: 0 30px 20px;
    color: #363434;
    cursor: pointer;
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
  width: 100%;
  height: 68px;
  background-color: ;
  position: fixed;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  display: none;
  background-color: #f2f1f0;

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
  width: 120px;
  text-align: center;
  cursor: pointer;
`;
const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: red;
  background: rgba(0, 0, 0, 0.5);
  @media screen and (min-width: 787px) {
    display: none;
  }
`;

const MobileNavWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 300px;
  height: 100vh;
  background-color: #dadedf;
  z-index: 10;
  @media screen and (min-width: 787px) {
    display: none;
  }
`;
const CloseButton = styled.div`
  position: absolute;
  top: 27px;
  right: 32px;
  font-size: 20px;
  cursor: pointer;
  color: #fff;
`;

function Header() {
  const [toggle, setToggle] = useState(false);
  const [isHint, setIsHint] = useState(false);
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
    await firebase.LogoutHandler().then(() => {
      setIsLoading(false);
      setIsHint(true);
    });
  }

  return (
    <>
      <PlaceHolder />
      {isHint && (
        <HintModal
          hintTitle={"您已成功登出"}
          logoutRedirect={() => navigate("/")}
        />
      )}
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
            <CloseButton onClick={closeToggleHandler}>×</CloseButton>
            <NavLinks>
              <MobileLink
                to="/library-search"
                onClick={() => closeToggleHandler("/library-search")}
              >
                圖書館
              </MobileLink>
              <MobileLink
                href="/books"
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
              <MobileLink onClick={logout}>登出</MobileLink>
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

export default Header;
