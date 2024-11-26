import { createContext, useEffect, useState } from "react";
import * as UserServices from "../server/userstore";



export const AuthContext = createContext()

export const AuthContextProvider = ({children}) =>{
    const [currentUser , setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user") )|| null
    );

    const [currentUserId, setCurrentUserId] = useState(
        JSON.parse(localStorage.getItem("friends") )|| null
    );

    const [currentUserProfile , setCurrentUserProfile] = useState();


    const login = async (loginData)=>{
       const response = await UserServices.loginUser(loginData);
       localStorage.setItem("access_token", JSON.stringify(response.data.token));
       const accessToken = response.data.token;
      // Call the getProfile function passing the token
      const profileUser = await UserServices.getProfile(accessToken);
      setCurrentUser(profileUser)
      console.log(currentUser.data.username)
    }

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
    },[currentUser]);   


    return (
        <AuthContext.Provider value = {{currentUser, login, setCurrentUser, currentUserId, setCurrentUserId, currentUserProfile , setCurrentUserProfile }}>
            {children}
        </AuthContext.Provider>
    )
}