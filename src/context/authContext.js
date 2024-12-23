import { createContext, useEffect, useState } from "react";
import * as UserServices from "../server/userstore";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(
    JSON.parse(localStorage.getItem("friends")) || null
  );

  const [currentUserProfile, setCurrentUserProfile] = useState();

  const login = async (loginData) => {
    try {
      const response = await UserServices.loginUser(loginData);
      if (response) {
        localStorage.setItem(
          "access_token",
          JSON.stringify(response.data.token)
        );
        const accessToken = response.data.token;
        if (!accessToken) {
          toast.error("Access token is missing. Login failed!");
          return;
        }
        // Call the getProfile function passing the token
        const profileUser = await UserServices.getProfile(accessToken);
        setCurrentUser(profileUser);
        toast.success(`Welcome back, ${profileUser.data.username}!`);
        // setIsAuthenticating(false);
        console.log(profileUser.data.username);
      }
    } catch (error) {
    //   setIsAuthenticating(true);
      // Handle API error and show toast
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again!";
      toast.error(errorMessage);
      console.error("Login error:", error);
      throw error
    } 
  };

  // const fetchFriends = async () => {
  //     try {
  //       // Assuming you have an accessToken, you can get it from your authentication context or elsewhere
  //       const accessToken = JSON.parse(localStorage.getItem("access_token"));
  //       const friends = await UserServices.getFriends(accessToken);
  //       setCurrentUserId({ userId: friends.listData[0].id, username: friends.listData[0].username });
  //     } catch (error) {
  //       console.error("Error fetching friends:", error.message);
  //     }
  //   };

  useEffect(() => {
    // fetchFriends()
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        setCurrentUser,
        currentUserId,
        setCurrentUserId,
        currentUserProfile,
        setCurrentUserProfile,
        isAuthenticating,
        setIsAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
