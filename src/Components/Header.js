import { useContext } from "react";
import styled from "styled-components";
import firebase from "../utils/firebaseTools";
import { NavLink, useNavigate } from "react-router-dom";
import { UserProfile } from "../App";

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
function Header() {
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
      <BarContent>
        <NavLinks to="/books">筆記櫃</NavLinks>
        <NavLinks to="/alltags">書籤櫃</NavLinks>
        <NavLinks to="/search">新增筆記</NavLinks>
        <NavLinks to="/site-search">站內搜尋</NavLinks>
        {userId ? (
          <NavLinks to="/login" onClick={logout}>
            登出
          </NavLinks>
        ) : (
          <NavLinks to="/login">登入</NavLinks>
        )}
      </BarContent>
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
