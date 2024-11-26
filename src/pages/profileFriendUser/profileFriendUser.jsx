import "./profileFriendUser.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";
import * as Userserver from "../../server/userstore";
import * as Postserver from "../../server/itemstore";
import { DarkModeContext } from "../../context/darkModeContext";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../../context/postContext";

const ProfileFriends = () => {
  const {
    currentUser,
    currentUserId,
    currentUserProfile,
    setCurrentUserProfile,
  } = useContext(AuthContext);
  const { darkMode, toggle } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { setPosts, setFollowingList, } = useContext(PostsContext);

  const [profileImage, setProfileImage] = useState(currentUser.data.profilePic);
  const [profileUserName, setprofileUserName] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        // Retrieve the access token from localStorage
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        const profileUser = await Userserver.getUserByUsername(
          accessToken,
          currentUserId.username
        );

        setCurrentUserProfile(profileUser);

        console.log("profileUser", profileUser);

        // const pictureUser = profileUser.listData[0].profilePic;
        // const backtureUser = profileUser.listData[0].backgroundPic;
        const profileUserName = profileUser.listData[0].username;

        // // Check if the access token is available
        // if (!accessToken) {
        //   console.error("Access token not found in localStorage");
        //   // Handle the case where the access token is not available
        //   return;
        // }

        // const userProfile = `http://localhost:3500/${pictureUser}`;
        // const userBackProfile = `http://localhost:3500/${backtureUser}`;
        // setProfileImage(userProfile);
        // setCoverImage(userBackProfile);
        setprofileUserName(profileUserName);
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    };

    const GetPostByUserId = async () => {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      console.log("userId", currentUserId);
      const response = await Postserver.getPostByUserId(
        accessToken,
        currentUserId.userId,
        9
      );

      setPosts(response.listData);
    };

    

    // Call the fetchUserProfilePicture function when the component mounts
    fetchFollowing();
    fetchUserProfilePicture();
    GetPostByUserId();
  }, []);

  const fetchFollowing = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      const followings = await Userserver.getFollowings(accessToken);

      console.log(
        "followings",
        currentUserId.userId,
        followings.listData[0].id
      );

      const isCurrentUserFollowing = followings.listData.some(
        (following) => following.id === currentUserId.userId
      );

      

      setIsFollowing(isCurrentUserFollowing);
      // Check if the currentUserId is in the list of followings
    } catch (error) {
      console.error("Error fetching user followings:", error);
    }
  };

  const handleFollowButtonClick = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      // Call the follow/unfollow API based on the current state
      if (isFollowing === false) {
        await Userserver.createFollow(accessToken, currentUserId.userId);
        setIsFollowing(true);
        const followings = await Userserver.getFollowings(accessToken);
        setFollowingList(followings.listData)
      } else {
        console.log("access_token", accessToken);
        await Userserver.UnFollow(accessToken, currentUserId.userId);
        setIsFollowing(false);
        const followings = await Userserver.getFollowings(accessToken);
        setFollowingList(followings.listData)
      }
    } catch (error) {
      console.error("Error handling follow button click:", error);
    }
  };

  return (
    <div className={`profiles ${darkMode ? "theme-dark" : "theme-light"}`}>
      <div className="images">
        {currentUserProfile && currentUserProfile.listData && (
          <>
            <img
              src={`http://localhost:3500/${currentUserProfile.listData[0].backgroundPic}`}
              alt=""
              className="cover"
            />
            <img
              src={`http://localhost:3500/${currentUserProfile.listData[0].profilePic}`}
              alt=""
              className="profilePic"
            />
          </>
        )}
        {/* <button className="uploadButtonPicCover" onClick={openPopupCover}>
            <FontAwesomeIcon icon={faCamera} size="2xl"  style={{ color: cameraIconColor }} />
          </button>
        <div className="open_popup">
          <button className="uploadButtonPic" onClick={openPopup}>
            <FontAwesomeIcon icon={faCamera} size="2xl"  style={{ color: cameraIconColor }} />
          </button>
        </div> */}
      </div>
      <div className="profileContainerss">
        <div className="uInfo">
          <div className="left"></div>
          <div className="center">
            <span>
              {currentUserProfile && currentUserProfile.listData && (
                <span>{currentUserProfile.listData[0].username}</span>
              )}
            </span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>Vietnam</span>
              </div>
            </div>
            <button onClick={handleFollowButtonClick}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default ProfileFriends;
