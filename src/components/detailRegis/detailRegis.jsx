import Posts from "../../components/posts/Posts";
import "./home.scss";
import ShareBox from "../../components/sharebox/ShareBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon
import React, { useContext, useEffect, useState} from "react";
import * as postserver from "../../server/itemstore"
import { PostsContext } from "../../context/postContext";
import { AuthContext } from "../../context/authContext";





const DetailRegis = () => {
  const { currentUser, currentUserId, setCurrentUserId } = useContext(AuthContext);
  const { setPostRegistrations, setSavePost, setFriendsList } = useContext(PostsContext);
  const {setPosts} = useContext(PostsContext);
  
  
  return (
    <div className="home">
      <Posts />
    </div>
  );
};

export default DetailRegis;
