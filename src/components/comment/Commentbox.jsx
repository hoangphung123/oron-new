import React, { useState, useEffect, useContext } from "react";
import * as postServer from "../../server/itemstore";
import { Button } from "antd";
import { PostsContext } from "../../context/postContext";
import { SendOutlined } from "@ant-design/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CommentBox = ({ comments, level = 1, postIds }) => {
  const [editCommentId, setEditCommentId] = useState(null);
  const [newCommentId, setNewCommentId] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [textareaValue, setTextareaValue] = useState("");
  const [parenIds, setParenIds] = useState(null); // set default to null
  const [commentPost, setCommetPost] = useState(comments || []);
  const { postId, commentsPost, setCommentsPost } = useContext(PostsContext);
  const currentUserId = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    getCommentsByPostId(postId);
  }, []);

  // Hàm render đệ quy để render comment và comment con
  const renderCommentTree = (commentList, level) => {
    return commentList.map((comment) => (
      <React.Fragment key={comment.id}>
        <div
          className={`contentts ${
            comment.parentId && comment.parentId.trim() !== ""
              ? "content_child"
              : ""
          }`}
        >
          <img src={comment?.user?.profilePic?.url || ""} alt="" />
          {comment.id === editCommentId || !comment.id ? (
            <div className="contentts_text">
              <textarea
                className="contentts_textarena"
                style={{ marginTop: "0.25rem", width: "100%" }}
                id={comment.id}
                name={comment.id}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                autoFocus
              />
              {/* <Button onClick={handleSendClick}>Send</Button> */}
              <SendOutlined
                style={{ color: "#1877F2", fontSize: "24px" }}
                onClick={handleSendClick}
              />
            </div>
          ) : (
            <div
              className="contentts_decription"
              style={{ padding: "0.25rem", border: "1px solid #ccc" }}
              onDoubleClick={() => {
                setEditCommentId(comment.id); // Set the edit mode when double-clicked
                setTextareaValue(comment.description); // Set the textarea value to the current comment's description
              }}
            >
              <p>{comment.user.name}</p>
              {comment.description || "Nhấp đúp để chỉnh sửa..."}
            </div>
          )}
        </div>
        <div className="action_comments">
          {comment.totalChild > 0 && (
            <button
              onClick={() => {
                handleFetchReplies(comment.id); // Gọi hàm fetch replies
              }}
            >
              {`${comment.totalChild} : Phản hồi`}
            </button>
          )}
          <div className="action_comments-button" style={{ textAlign: "end" }}>
            <button
              onClick={() => {
                addReply(comment.id);
              }}
            >
              Reply
            </button>
            {comment.userId === currentUserId.data.id && (
              <>
                <button onClick={() => deleteComment(comment.id, commentPost)}>
                  Delete
                </button>
                <button
                  onClick={() => {
                    setEditCommentId(comment.id);
                    setIsNew(false);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
        {/* Render comment children nếu có */}
        {comment.children && comment.children.length > 0 && (
          <div style={{ marginLeft: "1rem" }}>
            {renderCommentTree(comment.children, level + 1)}{" "}
            {/* Đệ quy render */}
          </div>
        )}
      </React.Fragment>
    ));
  };

  const getCommentsByPostId = async (postId) => {
    try {
      const response = await postServer.getCommentByPostId(postId);
      const data = response.listData;
      console.log("sau khi add", data);
      setCommetPost(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleFetchReplies = async (commentId) => {
    try {
      const response = await postServer.getchildByParentId(commentId); // Gọi API với commentId
      const childrenData = response.listData;

      // Hàm đệ quy để cập nhật children của comment có id trùng khớp
      const updateCommentTree = (comments) => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              children: childrenData, // Cập nhật children khi id trùng khớp
            };
          }
          if (comment.children && comment.children.length > 0) {
            return {
              ...comment,
              children: updateCommentTree(comment.children), // Gọi đệ quy để tìm trong children
            };
          }
          return comment;
        });
      };

      // Cập nhật cấu trúc cây comment
      setCommetPost((prevComments) => updateCommentTree(prevComments));
    } catch (error) {
      console.error("Lỗi khi tải phản hồi:", error);
    }
  };

  const handleSendClick = async () => {
    console.log(parenIds);
    if (isNew) {
      const value = textareaValue;
      const parentd = parenIds;
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      if (value.trim() === "") return;

      const commentData = {
        description: value,
        postId: postId,
        parentId: parentd, // ID của parent comment
        parentLevel: "",
      };
      console.log(commentData);
      try {
        // Gọi API để thêm comment
        const reponse = await postServer.uploadComment(
          accessToken,
          commentData
        );
        if (reponse) {
          getCommentsByPostId(postId);
          setTextareaValue("");
        }
      } catch (error) {
        console.error("Lỗi khi thêm comment:", error);
      }
    } else {
      const value = textareaValue;
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      if (value.trim() === "") return;
      const commentData = {
        description: value,
      };
      try {
        // Gọi API để thêm comment
        postServer.updateComment(accessToken, editCommentId, commentData);
        getCommentsByPostId(postId);
      } catch (error) {
        console.error("Lỗi khi thêm comment:", error);
      }
    }

    // setNewCommentId(null);
  };

  const addReply = async (id) => {
    setIsNew(true);

    let levels = 0; // Biến để lưu trữ cấp độ hiện tại

    const findCommentById = (comments, id, currentLevel = 1) => {
      for (const comment of comments) {
        if (comment.id === id) {
          levels = currentLevel; // Gán cấp độ hiện tại vào biến levels
          return comment;
        }
        if (comment.children && comment.children.length > 0) {
          const found = findCommentById(comment.children, id, currentLevel + 1); // Tăng cấp độ khi duyệt vào children
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const findParentComment = (comments, targetComment) => {
      for (const comment of comments) {
        if (comment.children && comment.children.includes(targetComment)) {
          return comment;
        }
        if (comment.children && comment.children.length > 0) {
          const found = findParentComment(comment.children, targetComment);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const parentComment = findCommentById(commentPost, id);

    if (parentComment) {
      if (!parentComment.children) {
        parentComment.children = [];
      }

      console.log("Cấp độ của parentComment:", levels);

      if (levels < 3) {
        parentComment.totalChild += 1;
        setParenIds(parentComment.id);
        parentComment.children.push({
          value: "",
          parentId: parentComment.id,
          level: levels + 1,
          children: [],
          user: {
            name: currentUserId.data.name, // Lấy tên người dùng
            profilePic: currentUserId.data.profilePic, // Lấy ảnh đại diện người dùng
          },
        });
      } else {
        const grandparentComment = findParentComment(
          commentPost,
          parentComment
        );
        console.log("ddd", grandparentComment);
        if (grandparentComment) {
          if (!grandparentComment.children) {
            parentComment.children = [];
          }
          grandparentComment.children.push({
            value: "",
            parentId: grandparentComment.id,
            level: levels,
            children: [],
            user: {
              name: currentUserId.data.name, // Lấy tên người dùng
              profilePic: currentUserId.data.profilePic, // Lấy ảnh đại diện người dùng
            },
          });
        } else {
          const siblings = commentPost.flatMap((c) => c.children);
          const siblingComment = siblings.find(
            (sibling) => sibling.id === parentComment.id
          );

          if (siblingComment) {
            parentComment.children.push({
              value: "",
              parentId: siblingComment.parentId || siblingComment.id,
              level: siblingComment.level,
              children: [],
            });
          } else {
            commentPost.push({
              value: "",
              parentId: parentComment.id,
              level: levels,
              children: [],
            });
          }
        }
      }
    }
    console.log(commentPost);
  };

  const deleteComment = async (id, parentComments) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));
    try {
      const reponse = await postServer.deleteComment(accessToken, id);
      if (reponse) {
        getCommentsByPostId(postId);
      }
    } catch (error) {
      console.error("Lỗi khi thêm comment:", error);
    }
  };

  const addComment = () => {
    setCommetPost([
      ...commentPost,
      {
        value: "",
        children: [],
        user: {
          name: currentUserId.data.name, // Lấy tên người dùng
          profilePic: { url: currentUserId.data.profilePic.url }, // Lấy ảnh đại diện người dùng
        },
      },
    ]);
    console.log(comments);
  };

  // const setClickparentId = (id) => {
  //   setParenIds(id)
  // }

  const setValue = async (e, id, isNew = true) => {
    const value = e.target.value;
    const comment = commentPost.find((comment) => comment.id === id);

    if (comment) {
      comment.value = value;
    }
  };

  return (
    <div style={{ marginLeft: "0.5rem" }}>
      <button
        className="button-89"
        style={{ marginLeft: "0.5rem", marginTop: "1rem" }}
        onClick={addComment}
      >
        Add Comment
        {/* <AddCircleOutlineIcon color="primary"/> */}
      </button>
      {renderCommentTree(commentPost, level)} {/* Gọi hàm render đệ quy */}
    </div>
  );
};

export default CommentBox;
