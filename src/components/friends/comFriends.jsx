import React from "react";
import "./ComFriends.scss";

const FriendsComponent = () => {
  // TEMPORARY
  const posts = [
    {
      name: "Tam Nhu",
      userId: 1,
      status: "online",
      profilePic: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      name: "Minh Nhat",
      userId: 2,
      status: "online",
      profilePic: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
    {
      name: "Khanh Linh",
      userId: 3,
      status: "online",
      profilePic: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
  ];

  return (
    <div className="Friends">
      {posts.map((user) => (
        <div key={user.userId} className="user">
          <img
            src={user.profilePic}
            alt={`Avatar of ${user.name}`}
            className="avatar"
          />
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className={`user-status ${user.status}`}>{user.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsComponent;

