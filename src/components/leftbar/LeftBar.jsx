import "./leftbar.scss";
import Friends from "./Users.png";
import Gallery from "./Save.png";
import Ranking from "./Ranking.png";
import Registation from "./Package.png"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { PostsContext } from "../../context/postContext";
import { Link } from "react-router-dom";
import * as Userserver from "../../server/userstore";
const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { savePost, setSavePost } = useContext(PostsContext);
  const [profileImage, setProfileImage] = useState(currentUser.data.profilePic);
  return (
    <div className="leftBar">
      <div className="container">
        {/* First Group Items */}
        <div className="menu">
          <div className="user">
            {/* Link to navigate to the user's profile */}
            <Link to={`/profile/${currentUser.id}`}>
              <img
                src={currentUser?.data?.profilePic?.url || ""
                }
                alt=""
              />
            </Link>
            <span>{currentUser.data.username}</span>
          </div>
          <hr />
          <div className="item">
            <Link
              to="/friends"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={Friends} alt="" />
            </Link>
            <span>Friends</span>
          </div>
          <div className="item">
            <Link
              to="/ranking"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={Ranking} alt="" />
            </Link>

            <span>Ranking</span>
          </div>
          <div className="item">
            <Link
              to="/detailRegistation"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={Registation} alt="" />
            </Link>
            <span>Registration for your post</span>
          </div>
          <div className="item">
            <Link
              to="/advertise"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={Registation} alt="" />
            </Link>
            <span>Sign up for advertising</span>
          </div>
          <hr />
          <div className="item">
            <Link
              to="/detailSavePort"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img src={Gallery} alt="" />
            </Link>
            <span>Saved Post</span>
          </div>
          <div className="item_save">
            {savePost.map((post, index) => (
              <div className="rectangle-box" key={index}>
                <div className="square">
                  <img
                    className="square_img"
                    src={post?.image[0].url || ""}
                    alt=""
                  />
                </div>
                <div className="text-container">
                  <div className="Name">{post.user.username}</div>
                  <div className="Decripstion">{post.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
