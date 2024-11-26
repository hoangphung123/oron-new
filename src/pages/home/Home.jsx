import Posts from "../../components/posts/Posts";
import "./home.scss";
import ShareBox from "../../components/sharebox/ShareBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon
import React, { useContext, useEffect, useState } from "react";
import * as postserver from "../../server/itemstore"
import { PostsContext } from "../../context/postContext";
import { AuthContext } from "../../context/authContext";
import Carousel from "../../components/carousel/Carousel";
import Submenu from '../../components/Submenu/Submenu';




const Home = () => {
  const {currentUser} = useContext(AuthContext);
  const {setPostRegistrations, setSavePost, setFriendsList, setPostRegistrationsByowner, categoryIds, setCategoryIds} = useContext(PostsContext);
  const {setPosts} = useContext(PostsContext);
  const [limit, setLimit] = useState(9);

  const fetchPosts = async (currentLimit) => {
    const categoryIdss = categoryIds;
    const accessToken = JSON.parse(localStorage.getItem('access_token'));
    const response = await postserver.getAllPost(accessToken, currentLimit, categoryIdss);
    const postData = response.listData;
    setPosts(postData);
  };

  const handleScroll = () => {
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight) {
      // Khi kéo đến cuối trang, tăng giá trị limit và gọi fetchPosts
      const newLimit = limit + 9; // Tăng limit lên 9 (hoặc giá trị khác tùy chọn)
      setLimit(newLimit);
      fetchPosts(newLimit);
    }
  };

  useEffect(() => {
    // Đăng ký sự kiện scroll để theo dõi việc kéo đến cuối trang
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const fetchPostsRegistation = async () => {
    try {
      setPostRegistrations(null)
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
      console.error(
        "Error while fetching post registrations:",
        error.message
      );
    }
  };

  const fetchSavePost = async () => {
    try {
      setSavePost([])
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await postserver.getSavedPostsByUser(
        accessToken,
      );
      setSavePost(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error(
        "Error while fetching List Friends:",
        error.message
      );
    }
  };

  const fetchListFriends = async () => {
    try {
      setFriendsList([])
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await postserver.getFriends(
        accessToken,
      );
      setFriendsList(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error(
        "Error while fetching List Friends:",
        error.message
      );
    }
  };

  const fetchPostsRegistationByOwner = async () => {
    try {
      setPostRegistrationsByowner([])
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
      console.error(
        "Error while fetching post registrations:",
        error.message
      );
    }
  }

  useEffect(() => {
    fetchPosts(limit); // Sử dụng giá trị limit
  }, []); 

  

  // Fetch initial posts when the component mounts
  useEffect(() => {
    setCategoryIds("")
    fetchPostsRegistationByOwner();
    fetchListFriends();
    fetchSavePost();
    fetchPostsRegistation();
    fetchPosts(limit); // Sử dụng giá trị limit
  },[]); 
  
  return (
    <div className="home">
      <Carousel />
      <Submenu />
      <ShareBox />
      {/* <button className="button_next">
        <FontAwesomeIcon icon={faAngleRight} size="xl" />
      </button> */}
      <Posts />
    </div>
  );
};

export default Home;
