import { useState, useContext, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import * as postServer from "../../server/itemstore";
import { formatDistanceToNow } from "date-fns";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { PostsContext } from "../../context/postContext";
import Rating from "react-rating";
import CommentBox from "../comment/Commentbox";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const currentUsers = JSON.parse(localStorage.getItem("user"));

  // State to manage comments
  const [comments, setComments] = useState([]);
  const { setPosts, categoryIds, setCommentsPost } = useContext(PostsContext);
  const [ratingValue, setRatingValue] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [Reviewer, setReviewer] = useState([]);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [reviewDescription, setReviewDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [editingCommentId, setEditingCommentId] = useState(null);

  // State to manage edited comment
  const [editedComment, setEditedComment] = useState({
    id: null,
    description: "",
  });

  const addComment = () => {
    setComments([
      ...comments,
      {
        value: "",
        children: [],
        user: {
          name: currentUsers.data.name, // Lấy tên người dùng
          profilePic: currentUsers.data.profilePic, // Lấy ảnh đại diện người dùng
        },
      },
    ]);
    console.log(comments)
  };

  // const onChange = (comment) => {
  //   setComments(
  //     comments.map((comm) => {
  //       return comm.id === comment.id ? comment : comm;
  //     })
  //   );
  // };

  const openEditPopup = (commentId) => {
    setEditingCommentId(commentId);
  };

  const handleRatingChange = (value) => {
    setRatingValue(value);
  };

  const handleKeyPress = (e, commentId) => {
    if (e.key === "Enter") {
      // Người dùng bấm Enter, gọi hàm handleEditComment
      handleEditComment(commentId);
      setEditingCommentId(null); // Kết thúc chỉnh sửa
    }
  };

  const handleKeyPresss = (e, postId) => {
    if (e.key === "Enter") {
      // Người dùng bấm Enter, gọi hàm handleEditComment
      // Kết thúc chỉnh sửa
      handleAddComment(postId);
    }
  };

  const handleMenuClick = (event, commentId, commentDescription) => {
    // Lưu trữ comment.id vào state
    setEditedComment({ id: commentId, description: commentDescription });

    // Mở Menu
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteReview = async (reviewId) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));

    try {
      // Make an API call to delete the review
      await postServer.deleteReview(accessToken, reviewId);
      setReviewer([]);

      const limit = 9;
      const response = await postServer.getAllPost(
        accessToken,
        limit,
        categoryIds
      );
      const postData = response.listData;
      setPosts(postData);
      // Set the deleted review ID for UI updates
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      // Use the ratingValue and reviewDescription in the CreateReview function
      const reviewData = {
        description: reviewDescription,
        numberStar: ratingValue,
      };

      // Call the CreateReview function with the reviewData
      await postServer.updateReview(accessToken, reviewId, reviewData);

      const limit = 9;
      const response = await postServer.getAllPost(
        accessToken,
        limit,
        categoryIds
      );
      const postData = response.listData;
      setPosts(postData);

      const updatedReviewers = Reviewer.map((r) =>
        r.id === reviewId
          ? { ...r, description: reviewDescription, numberStar: ratingValue }
          : r
      );
      setReviewer(updatedReviewers);

      // Close the rating popup
      setIsRatingPopupOpen(false);
    } catch (error) {
      console.error("Error update review:", error.message);
      // Handle error, show a notification, or perform other actions
    }
  };

  const handleEditComment = async (commentId) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));

    const updatedCommentData = {
      description: editDescription,
    };

    try {
      // Gọi API để cập nhật comment
      await postServer.updateComment(
        accessToken,
        commentId,
        updatedCommentData
      );

      // Cập nhật lại danh sách comments
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, description: editDescription }
          : comment
      );

      setComments(updatedComments);
      setEditDescription(null); // Kết thúc chỉnh sửa
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to handle adding a new comment
  const handleAddComment = async (postId) => {
    if (newComment.trim() === "") {
      return; // Do not add empty comments
    }
    const accessToken = JSON.parse(localStorage.getItem("access_token"));
    const commentData = {
      description: newComment,
      postId: postId,
      parentId: "0cb1e867-b55e-434a-8661-73a591cb0e79",
      parentLevel: 1,
    };

    await postServer.uploadComment(accessToken, commentData);

    const response = await postServer.getCommentByPostId(postId);
    const data = response.listData;
    // Update comments state with the fetched data
    setComments(data);
    // Clear the new comment input
    setNewComment("");
  };

  const handleDeleteComment = async (commentId) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));

    try {
      // Make an API call to delete the comment
      await postServer.deleteComment(accessToken, commentId);

      // Update the comments state after deletion
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
      setAnchorEl(null);

      // Add any additional logic or notifications as needed
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Simulating API call to get comments by postId
  const getCommentsByPostId = async (postId) => {
    // Replace the following with your actual API call
    try {
      const response = await postServer.getCommentByPostId(postId);
      const data = response.listData;
      // Update comments state with the fetched data
      setComments(data);
      setCommentsPost(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const formatTimeDifference = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const getReviewerByPostId = async (postId) => {
    // Replace the following with your actual API call
    try {
      const response = await postServer.getReviewByPost(postId);
      const data = response.listData;

      // Update comments state with the fetched data
      setReviewer(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const closePopup = () => {
    setIsRatingPopupOpen(false);
  };

  useEffect(() => {
    // Call getCommentsByPostId when postId changes
    if (postId) {
      // getPostByPostId(postId);
      getReviewerByPostId(postId);
      getCommentsByPostId(postId);
    }
  }, [postId]);

  return (
    <div className="comments">
      {Reviewer.map((Reviewers) => (
        <div className="comment" key={Reviewers.id}>
          <img
            src={`http://localhost:3500/${Reviewers.user.profilePic}`}
            alt=""
          />
          <div className="info">
            <span>{Reviewers.user.username}</span>
            <p>{Reviewers.description}</p>
          </div>
          <div>
            {currentUser.data.username === Reviewers.user.username && (
              <div>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteReview(Reviewers.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setIsRatingPopupOpen(!isRatingPopupOpen)}
                >
                  Edit
                </Button>
              </div>
            )}
            {currentUser.data.username !== Reviewers.user.username && (
              <Button
                variant="contained"
                size="small"
                // handle the action for the "Reviewer" button
              >
                Reviewer
              </Button>
            )}
          </div>
          {isRatingPopupOpen && (
            <>
              <div className="overlay" onClick={closePopup}></div>
              <div className="rating-popup">
                <Rating
                  initialRating={Reviewers.numberStar}
                  emptySymbol={<span className="icon">&#9734;</span>} // Biểu tượng sao Unicode
                  fullSymbol={<span className="icon">&#9733;</span>} // Biểu tượng sao Unicode
                  onChange={handleRatingChange} // Hàm gọi lại khi rating thay đổi
                />
                <input
                  type="text"
                  placeholder="Enter your comment here..."
                  className="wide-input" // Add a class for custom styling
                  value={reviewDescription}
                  onChange={(e) => setReviewDescription(e.target.value)}
                />
                <Button
                  onClick={() => handleUpdateReview(Reviewers.id)}
                  variant="contained"
                  className="acsess_button"
                  size="medium"
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
      <hr />
      {/* <div className="write">
        <img
          src={`http://localhost:3500/${currentUser.data.profilePic}`}
          alt=""
        />
        <input
          type="text"
          placeholder="Write a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyUp={(e) => handleKeyPresss(e, postId)}
        />
        <button onClick={() => handleAddComment(postId)}>Send</button>
      </div> */}
      {/* <button
        style={{ marginLeft: "0.5rem", marginTop: "1rem" }}
        onClick={addComment}
      >
        Add Comment
      </button> */}
      <CommentBox comments={comments} postIds={postId} />
      {/* {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img
            src={`http://localhost:3500/${comment.user.profilePic}`}
            alt=""
          />
          <div className="infoComment">
            <span>{comment.user.username}</span>
            {editingCommentId === comment.id ? (
              <input
                type="text"
                placeholder="Enter your comment"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyUp={(e) => handleKeyPress(e, comment.id)}
                onBlur={() => {
                  setEditingCommentId(null);
                  setEditDescription(""); // Clear the editDescription state when losing focus
                }}
              />
            ) : (
              <p>{comment.description}</p>
            )}
          </div>
          <div className="menu_date">
            <span className="date">
              {formatTimeDifference(comment.createdAt)}
            </span>
            {currentUser.data.username === comment.user.username && (
              <div>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  style={{ color: "#fff" }}
                  onClick={(e) =>
                    handleMenuClick(e, comment.id, comment.description)
                  }
                  className="iconButtonMenu"
                >
                  <MoreHorizIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => openEditPopup(editedComment.id)}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteComment(comment.id)}>Delete</MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </div>
      ))} */}
      {/* {isEditPopupOpen && (
        <>
          <div className="overlay" onClick={closeEditPopup}></div>
          <div className="rating-popup">
            <input
              type="text"
              placeholder="Edit your comment here..."
              className="wide-input"
              value={editedComment.description}
              onChange={(e) =>
                setEditedComment({
                  ...editedComment,
                  description: e.target.value,
                })
              }
            />
            <Button
              // onClick={() => handleEditComment(editedComment)}
              variant="contained"
              className="access_button"
              size="medium"
            >
              Save
            </Button>
          </div>
        </>
      )} */}
    </div>
  );
};

export default Comments;
