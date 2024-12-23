import React, { useContext, useState } from "react";
import "./FriendPage.scss";
import { PostsContext } from "../../context/postContext";
import { AuthContext } from "../../context/authContext";
import * as Userserver from "../../server/userstore";
import { Link, useNavigate} from "react-router-dom";

const FriendPage = ({ type }) => {
  const { friendsList, followingList, followerList } = useContext(PostsContext);
  const { currentUser, setCurrentUserId } = useContext(AuthContext);
  const [followStates, setFollowStates] = useState({});
  const navigate = useNavigate();

  const handleFollowButtonClick = async (friendId) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const isCurrentlyFollowing = followStates[friendId];

      // Call the follow/unfollow API based on the current state
      if (isCurrentlyFollowing) {
        await Userserver.createFollow(accessToken, friendId);
      } else {
        await Userserver.UnFollow(accessToken, friendId);
      }

      // Update the follow state for the specific user
      setFollowStates((prevStates) => ({
        ...prevStates,
        [friendId]: !isCurrentlyFollowing,
      }));
    } catch (error) {
      console.error("Error handling follow button click:", error);
    }
  };

  let data;

  if (type === "follow") {
    data = followingList;
  } else if (type === "follower") {
    data = followerList;
  } else if (type === "friendRequest") {
    data = friendsList;
  }

  const handleUserClicks = ({ userId, username }) => {
    // Use the userId and username
    const updatedUserId = { userId, username };
    setCurrentUserId(updatedUserId);

    // Store the updated user data in localStorage
    localStorage.setItem("friends", JSON.stringify(updatedUserId));
    navigate("/profileFriends");
  };

  return (
    <div className="friend-container">
      <h2>
        {type === "follow"
          ? "Follow"
          : type === "follower"
          ? "Follower"
          : "Friend Request"}
      </h2>
      <div className="friend-request-container" >
        {data.map((person, index) => (
          <div key={index} className="friend-request-card" >
            <img
              src={person.profilePic.url || ""}
              alt={person.name}
              className="friend-request-image"
              onClick={() =>
                handleUserClicks({
                  userId: person.id,
                  username: person.username,
                })
              }
            />
            <h3 className="friend-request-name">{person.username}</h3>
            {type !== "follower" && (
              <button
                className="delete-button"
                onClick={() => handleFollowButtonClick(person.id)}
              >
                {followStates[person.id] ?  "Follow" : "Unfollow" }
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendPage;
