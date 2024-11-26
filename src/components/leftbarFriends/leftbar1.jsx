import "./leftbar1.scss";
import { useContext, useState, useEffect } from "react";
import { PostsContext } from "../../context/postContext";
import { AuthContext } from "../../context/authContext";
import * as Userserver from "../../server/userstore";
import * as Postserver from "../../server/itemstore";

const LeftBar1 = ({ setSelectedTab }) => {
  const { friendsList, followingList, followerList } = useContext(PostsContext);
  const [selectedTab, setLocalSelectedTab] = useState("following");
  const { currentUserId, setCurrentUserId, setCurrentUserProfile } = useContext(AuthContext);
  const { setPosts, setFriendsList, setFollowingList, setFollowerList } = useContext(PostsContext);

  let dataToRender = [];

  if (selectedTab === "friends") {
    dataToRender = friendsList;
  } else if (selectedTab === "followers") {
    dataToRender = followerList;
  } else if (selectedTab === "following") {
    dataToRender = followingList;
  }

  const handleUserClick = async (userId, username) => {
    const updatedUserId = { userId, username };
    setCurrentUserId(updatedUserId);

    const accessToken = JSON.parse(localStorage.getItem("access_token"));

    const res = await Userserver.getUserByUsername(accessToken, currentUserId.username);
    setCurrentUserProfile(res);

    const response = await Postserver.getPostByUserId(accessToken, currentUserId.userId, 9);
    setPosts(response.listData);

    localStorage.setItem("friends", JSON.stringify(updatedUserId));
  };

  const fetchListFriends = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await Postserver.getFriends(accessToken);
      setFriendsList(result.listData);
    } catch (error) {
      console.error("Error while fetching List Friends:", error.message);
    }
  };

  const fetchListFollowing = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await Postserver.getFollowing(accessToken);
      setFollowingList(result.listData);
    } catch (error) {
      console.error("Error while fetching List Following:", error.message);
    }
  };

  const fetchListFollower = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await Postserver.getFollower(accessToken);
      setFollowerList(result.listData);
    } catch (error) {
      console.error("Error while fetching List Follower:", error.message);
    }
  };

  useEffect(() => {
    fetchListFriends();
    fetchListFollowing();
    fetchListFollower();
  }, []);

  const handleTabClick = (tabName) => {
    setLocalSelectedTab(tabName);
    setSelectedTab(tabName); // Pass the selected tab up to the parent component
  };

  return (
    <div className="leftBar1">
      <div className="container">
        <hr />
        <div
          className={`tab ${selectedTab === "friendRequest" ? "active" : ""}`}
          onClick={() => handleTabClick("friendRequest")}
        >
          Friends
        </div>
        <div className="tabs">
          {/* <div
            className={`tab ${selectedTab === "friends" ? "active" : ""}`}
            onClick={() => handleTabClick("friends")}
          >
            Friends
          </div> */}
          <div
            className={`tab ${selectedTab === "followers" ? "active" : ""}`}
            onClick={() => handleTabClick("followers")}
          >
            Followers
          </div>
          <div
            className={`tab ${selectedTab === "following" ? "active" : ""}`}
            onClick={() => handleTabClick("following")}
          >
            Following
          </div>
        </div>
        <div className="menu">
          {dataToRender.map((userData, index) => (
            <div
              className="user"
              key={index}
              onClick={() => handleUserClick(userData.id, userData.username)}
            >
              <div className="userInfos">
                <img
                  src={`http://localhost:3500/${userData.profilePic}`}
                  alt=""
                />
                <div className="online" />
                <span>{userData.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftBar1;
