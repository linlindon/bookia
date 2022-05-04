import { useContext, useState } from "react";
import styled from "styled-components";
import { Search } from "@styled-icons/heroicons-solid/Search";
import { Logout } from "@styled-icons/heroicons-outline/Logout";
import firebase from "../utils/firebaseTools";
import { NavLink, useNavigate } from "react-router-dom";
import { UserProfile } from "../App";

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  margin: 1.5%;
  align-items: baseline;

  ${"" /* background-color: #dedede; */}
`;
const Logo = styled.div`
  margin-right: 5%;
  font-size: 28px;
  font-weight: 700;
`;

const LinksContainer = styled.div`
  width: 35%;
  margin-right: auto;
`;
const NavLinks = styled(NavLink)`
  text-decoration: none;
  padding: 4px 6px;
  ${"" /* margin-right: 5px; */}
  font-size: 14px;
  color: #363434;
  ${"" /* background-color: #ffffff; */}
  border-radius: 5px;
`;
const SignContainer = styled.div`
  position: relative;
  width: 10%;
`;
const SiteSearch = styled(Search)`
  width: 22px;
  margin-right: 25%;
  color: #363434;
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
`;
const LogoutSign = styled(Logout)`
  posiiton: absolute;
  width: 22px;
  cursor: pointer;
`;
const LogoutHint = styled.div`
  position: absolute;
  left: 3vw;
  top: 30px;
  width: 50px;
  padding: 3px 8px;
  border-radius: 5px;
  text-align: center;
  background-color: #ffffff;
`;

function Header() {
  const [isShowSearchHint, setIsShowSearchHint] = useState(false);
  const [isShowLogoutHint, setIsShowLogoutHint] = useState(false);
  const navigate = useNavigate();
  const userId = useContext(UserProfile);
  console.log("header render");

  async function logout() {
    await firebase.LogoutHandler().then(() => {
      navigate("/login");
    });
  }

  return (
    <Navbar>
      <Logo>Bookia</Logo>

      <LinksContainer>
        <NavLinks to="/books">筆記櫃</NavLinks>
        <NavLinks to="/alltags">書籤櫃</NavLinks>
        <NavLinks to="/search">新增筆記</NavLinks>
      </LinksContainer>
      <SignContainer>
        <NavLink to="/site-search">
          <SiteSearch
            onMouseEnter={() => setIsShowSearchHint(true)}
            onMouseLeave={() => setIsShowSearchHint(false)}
          />
          {isShowSearchHint && <SearchHint>站內搜尋</SearchHint>}
        </NavLink>

        <LogoutSign
          to="/login"
          onClick={logout}
          onMouseEnter={() => setIsShowLogoutHint(true)}
          onMouseLeave={() => setIsShowLogoutHint(false)}
        />
        {isShowLogoutHint && <LogoutHint>登出</LogoutHint>}
      </SignContainer>
    </Navbar>
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
