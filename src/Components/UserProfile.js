import { createContext, useState } from "react";

export const UserProfile = createContext();

export const UserProvider = (props) => {
  const [userId, setUserId] = useState("");
  console.log(userId);
  return (
    <UserProfile.Provider value={[userId, setUserId]}>
      {props.children}
    </UserProfile.Provider>
  );
};
