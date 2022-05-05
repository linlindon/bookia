import { useContext, useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
import { Logout } from "@styled-icons/heroicons-outline/Logout";
import { Menu } from "@styled-icons/heroicons-outline/Menu";
import firebase from "../utils/firebaseTools";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { UserProfile } from "../App";

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
  align-items: baseline;

  @media screen and (max-width: 786px) {
    display: none;
  }
`;
const Logo = styled.a`
  margin-right: 5%;
  font-size: 28px;
  font-weight: 700;
`;

const NavLinks = styled.div`
  width: 65%;

  @media screen and (max-width: 786px) {
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
  font-size: 14px;
  color: #363434;
  font-weight: 600;
  border-radius: 5px;

  &:hover {
    color: #000;
  }
  @media screen and (max-width: 786px) {
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    margin: 0 30px 20px;
  }
`;
const MobileLink = styled.p`
  @media screen and (max-width: 786px) {
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
  width: 80px;
  padding-bottom: 6px;
`;
const SiteSearch = styled(Search)`
  width: 22px;
  margin-right: 25%;
  color: #363434;
  cursor: pointer;
`;
const SearchHint = styled.div`
  position: absolute;
  left: -2vw;
  top: 30px;
  width: 80px;
  padding: 3px 8px;
  border-radius: 5px;
  text-align: center;
  background-color: #ffffff;
  font-weight: 500;
`;
const LogoutSign = styled(Logout)`
  posiiton: absolute;
  width: 22px;
  cursor: pointer;
`;
const LogoutHint = styled.div`
  position: absolute;
  left: 2vw;
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

  @media screen and (max-width: 786px) {
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

const HamburgerTitle = styled.div`
  font-weight: 700;
  text-align: center;
  font-size: 24px;
  line-height: 36px;
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
  const [isShowSearchHint, setIsShowSearchHint] = useState(false);
  const [isShowLogoutHint, setIsShowLogoutHint] = useState(false);
  const navigate = useNavigate();
  const userId = useContext(UserProfile);
  console.log("header render");

  function closeToggleHandler(link) {
    setToggle(false);
    navigate(link);
  }
  async function logout() {
    if (toggle) {
      setToggle(false);
    }
    await firebase.LogoutHandler().then(() => {
      navigate("/login");
    });
  }

  return (
    <>
      <PlaceHolder />

      <HamburgerNav>
        <HamburgerBtn src={Menu} onClick={() => setToggle(true)} />
        <HamburgerTitle>Bookia</HamburgerTitle>
      </HamburgerNav>

      {toggle && (
        <>
          <MobileMenuOverlay />
          <MobileNavWrapper>
            <CloseButton onClick={closeToggleHandler}>×</CloseButton>
            <NavLinks>
              <MobileLink
                href="/books"
                onClick={() => closeToggleHandler("/books")}
              >
                筆記櫃
              </MobileLink>
              <MobileLink
                to="/alltags"
                onClick={() => closeToggleHandler("/alltags")}
              >
                書籤櫃
              </MobileLink>
              <MobileLink
                to="/search"
                onClick={() => closeToggleHandler("/search")}
              >
                新增筆記
              </MobileLink>
              <MobileLink
                to="/site-search"
                onClick={() => closeToggleHandler("/site-search")}
              >
                站內搜尋
              </MobileLink>
              <MobileLink onClick={logout}>登出</MobileLink>
            </NavLinks>
          </MobileNavWrapper>
        </>
      )}

      <NavbarWrapper>
        <Logo to="/books">Bookia</Logo>
        <NavLinks>
          <Nav to="/books">筆記櫃</Nav>
          <Nav to="/alltags">書籤櫃</Nav>
          <Nav to="/search">新增筆記</Nav>
        </NavLinks>
        <SignContainer>
          <Link to="/site-search">
            <SiteSearch
              onMouseEnter={() => setIsShowSearchHint(true)}
              onMouseLeave={() => setIsShowSearchHint(false)}
            />
            {isShowSearchHint && <SearchHint>站內搜尋</SearchHint>}
          </Link>

          <LogoutSign
            to="/login"
            onClick={logout}
            onMouseEnter={() => setIsShowLogoutHint(true)}
            onMouseLeave={() => setIsShowLogoutHint(false)}
          />
          {isShowLogoutHint && <LogoutHint>登出</LogoutHint>}
        </SignContainer>
      </NavbarWrapper>
    </>
  );
}

export default Header;

// import Box from '@mui/material/Box';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import RestoreIcon from '@mui/icons-material/Restore';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocationOnIcon from '@mui/icons-material/LocationOn';

// export default function SimpleBottomNavigation() {
//   const [value, setValue] = React.useState(0);

//   return (
//     <Box sx={{ width: 500 }}>
//       <BottomNavigation
//         showLabels
//         value={value}
//         onChange={(event, newValue) => {
//           setValue(newValue);
//         }}
//       >
//         <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
//         <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
//         <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
//       </BottomNavigation>
//     </Box>
//   );
// }
