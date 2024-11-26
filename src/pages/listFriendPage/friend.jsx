import NavBar from "../../components/navbar/NavBar.jsx";
import LeftBar1 from "../../components/leftbarFriends/leftbar1.jsx";
import { Outlet } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext.js";
import { useContext, useState, useEffect } from "react";
import * as Userserver from "../../server/itemstore.js";
import { AuthContext } from "../../context/authContext.js";
import FriendPage from "../../components/friendFollowRequest/FriendFollowRequest";
import "./listFriend.scss"

const Friend = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUserId, setCurrentUserId } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState("friendRequest"); // State for the selected tab

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        const friends = await Userserver.getFriends(accessToken);
        setCurrentUserId({
          userId: friends.listData[0].id,
          username: friends.listData[0].username,
        });
        localStorage.setItem("friends", JSON.stringify(currentUserId));
      } catch (error) {
        console.error("Error fetching friends:", error.message);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <NavBar />
      <div style={{ display: "flex" }}>
        <LeftBar1 setSelectedTab={setSelectedTab} /> {/* Pass setSelectedTab as a prop */}
        <div className="Friend_content-follow" style={{ flex: 6 }}>
          {selectedTab === "following" && <FriendPage type="follow" />}
          {selectedTab === "followers" && <FriendPage type="follower" />}
          {selectedTab === "friendRequest" && <FriendPage type="friendRequest" />}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Friend;
