import NavBar from "../../components/navbar/NavBar.jsx";
import LeftBar from "../../components/leftbar/LeftBar.jsx";
import RegisOder from "../../components/regisOder/regisOder.jsx";
import { Outlet } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext.js";
import { useContext, useEffect, useState } from "react";
import FriendsComponent from "../profileFriendUser/profileFriendUser.jsx";
import * as Userserver from "../../server/itemstore.js";
import { AuthContext } from "../../context/authContext.js";
import { PostsContext } from "../../context/postContext";
import PostRegistation from "../../components/postRegistation/postRegistation.jsx";
import "./detail.scss";

const DetailRegister = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser, currentUserId, setCurrentUserId } =
    useContext(AuthContext);
  const [ postss, setPostss ] = useState([]);

  //   useEffect(() => {
  //     const fetchFriends = async () => {
  //       try {
  //         // Assuming you have an accessToken, you can get it from your authentication context or elsewhere
  //         const accessToken = JSON.parse(localStorage.getItem("access_token"));
  //         const friends = await Userserver.getFriends(accessToken);
  //         setCurrentUserId({ userId: friends.listData[0].id, username: friends.listData[0].username });
  //         localStorage.setItem("friends", JSON.stringify(currentUserId));
  //       } catch (error) {
  //         console.error("Error fetching friends:", error.message);
  //       }
  //     };

  //     fetchFriends();
  //   }, []);

  useEffect(() => {
    const GetPostByUserId = async () => {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const userID = currentUser.data.id;
      const response = await Userserver.getPostByUserIdStattus(accessToken, userID);

      setPostss(response.listData);
    };

    // Call the fetchUserProfilePicture function when the component mounts

    GetPostByUserId();
  }, []);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <NavBar />
      <div style={{ display: "flex" }} className="regis-main">
        <LeftBar />
        <div style={{ flex: 6 }}>
          <div className="posts">
            <div className="regis_right">Register for your post</div>
            {Array.isArray(postss) &&
              postss.map((post) => (
                <PostRegistation post={post} key={post.id} />
              ))}
          </div>
          <Outlet />
        </div>
        <div style={{ flex: 3, height: '100%' }}>
          <div className="regis_right">Register for oder post</div>
          <RegisOder />
        </div>
      </div>
    </div>
  );
};

export default DetailRegister;
