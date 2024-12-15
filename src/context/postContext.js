import React, { createContext, useEffect, useState, useContext } from "react";
import * as postserver from "../server/itemstore";
import { AuthContext } from "./authContext";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [postId, setPostId] = useState("");
  const [postRegistrations, setPostRegistrations] = useState([]);
  const [postRegistrationsByOwner, setPostRegistrationsByowner] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const [savePost, setSavePost] = useState([]);
  const [categoryIds, setCategoryIds] = useState("");
  const [commentsPost, setCommentsPost] = useState([])

  const fetchPostsRegistation = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const userId = currentUser.data.id; // Thay thế bằng userId của người dùng cụ thể
      const limit = 3;
      const status = 1;
      const result = await postserver.getPostRegistrationByUserId(
        accessToken,
        userId,
        limit,
        status
      );
      setPostRegistrations(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching post registrations:", error.message);
    }
  };

  const fetchPostsRegistationByOwner = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const userId = currentUser.data.id; // Thay thế bằng userId của người dùng cụ thể
      const limit = 3;
      const status = 1;
      const result = await postserver.getPostRegistrationByPostownerId(
        accessToken,
        userId,
        limit,
        status
      );
      setPostRegistrationsByowner(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching post registrations:", error.message);
    }
  };

  const fetchListFriends = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await postserver.getFriends(accessToken);
      setFriendsList(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching List Friends:", error.message);
    }
  };

  const fetchListFollowing = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await postserver.getFollowing(accessToken);
      setFollowingList(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching List Friends:", error.message);
    }
  };

  const fetchListFollower = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await postserver.getFollower(accessToken);
      setFollowerList(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching List Friends:", error.message);
    }
  };

  const fetchSavePost = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await postserver.getSavedPostsByUser(accessToken);
      setSavePost(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching List Friends:", error.message);
    }
  };

  const fetchPosts = async (limit) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));
    // Fetch posts with the specified limit parameter
    const category = "";
    const response = await postserver.getAllPost(accessToken, limit, category);
    const postData = response.listData;
    setPosts(postData);
  };

  // Fetch initial posts when the component mounts
  useEffect(() => {
    fetchPostsRegistationByOwner();
    fetchSavePost();
    fetchListFollower();
    fetchListFollowing();
    fetchListFriends();
    fetchPostsRegistation();
    fetchPosts(9); // Default limit is set to 2, change it as needed
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        postId,
        setPostId,
        setPosts,
        postRegistrations,
        setPostRegistrations,
        friendsList,
        setFriendsList,
        followingList,
        setFollowingList,
        followerList,
        setFollowerList,
        savePost,
        setSavePost,
        postRegistrationsByOwner,
        setPostRegistrationsByowner,
        categoryIds, 
        setCategoryIds,
        commentsPost,
        setCommentsPost
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
