import React, { useState } from "react";
import * as postServer from "../../server/itemstore";

export const CommentBox = ({ comments, onChange, level = 1, postIds }) => {
  const [editCommentId, setEditCommentId] = useState(null); // Theo dõi comment đang chỉnh sửa
  const [newCommentId, setNewCommentId] = useState(null); // Theo dõi comment đang được thêm mới
  const [isNew, setIsNew] = useState(true)

  const handleKeyPress = async (e, id) => {
    if (e.key === "Enter") {
      if (isNew) {
        const value = e.target.value;
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        if (value.trim() === "") return; // Không thêm nếu comment trống
        const commentData = {
          description: value,
          postId: postIds,
          parentId: null, // ID của parent comment
          parentLevel: null, // Level của comment hiện tại
        };
        try {
          // Gọi API để thêm comment
          await postServer.uploadComment(accessToken, commentData);
        } catch (error) {
          console.error("Lỗi khi thêm comment:", error);
        }
      }
      if (isNew) {
        setNewCommentId(null); // Thoát trạng thái thêm mới
      } else {
        setEditCommentId(null); // Thoát trạng thái chỉnh sửa
      }
    }
  };

  const addReply = (id) => {
    setIsNew(true)
    const parentComment = comments.find((comment) => comment.id === id);
    console.log(parentComment)
    if (parentComment) {
      // Khởi tạo mảng children nếu chưa có
      if (!parentComment.children) {
        parentComment.children = [];
      }
      // const newReplyId = String(Number(`${id}`) + 100);
      let parentIds = parentComment.id;

      if (level < 3) {
        parentComment.children.push({
          // id: newReplyId,
          value: "",
          parentId: parentComment.id,
          level: level + 1,
          children: [],
        });
      } else {
        const grandparentComment = comments.find((c) =>
          c.children.includes(parentComment)
        );

        if (grandparentComment) {
          grandparentComment.children.push({
            // id: newReplyId,
            value: "",
            parentId: grandparentComment.id,
            level: level,
            children: [],
          });
        } else {
          const siblings = comments.flatMap((c) => c.children);
          const siblingComment = siblings.find(
            (sibling) => sibling.id === parentComment.id
          );

          if (siblingComment) {
            parentComment.children.push({
              // id: newReplyId,
              value: "",
              parentId: siblingComment.parentId || siblingComment.id,
              level: siblingComment.level,
              children: [],
            });
          } else {
            comments.push({
              // id: newReplyId,
              value: "",
              parentId: parentIds,
              level: level,
              children: [],
            });
          }
        }
      }
      // setNewCommentId(newReplyId); // Đặt trạng thái thêm mới
      onChange(comments); // Cập nhật comments trong state
    }
  };

  const deleteComment = (id, parentComments) => {
    const index = parentComments.findIndex((comment) => comment.id === id);
    if (index !== -1) {
      parentComments.splice(index, 1);
      onChange(comments); // Cập nhật comments trong state
    } else {
      for (let comment of parentComments) {
        if (Array.isArray(comment.children) && comment.children.length > 0) {
          deleteComment(id, comment.children);
        }
      }
    }
  };

  const setValue = async (e, id, isNew = true) => {
    const value = e.target.value;
    const comment = comments.find((comment) => comment.id === id);
    const accessToken = JSON.parse(localStorage.getItem("access_token"));

    if (comment) {
      comment.value = value;

      // Gọi API tùy theo hành động
      if (isNew) {
        if (value.trim() === "") return; // Không thêm nếu comment trống
        const commentData = {
          description: value,
          postId: postIds,
          parentId: null, // ID của parent comment
          parentLevel: null, // Level của comment hiện tại
        };
        try {
          // Gọi API để thêm comment
          await postServer.uploadComment(accessToken, commentData);

          // Lấy lại danh sách comment cập nhật từ API
          await postServer.uploadComment(accessToken, commentData);
        } catch (error) {
          console.error("Lỗi khi thêm comment:", error);
        }
      } else {
        // Gọi API cho chỉnh sửa comment
        console.log("Gọi API chỉnh sửa:", { id, value });
        // callUpdateCommentAPI({ id, value }); // API chỉnh sửa
      }
    }
    onChange(comments); // Cập nhật state
  };

  return (
    <div style={{ marginLeft: "0.5rem" }}>
      {Array.isArray(comments) &&
        comments.map((comment) => (
          <React.Fragment key={comment.id}>
            <div className="content">
              <img src={comment.img} alt="hình không có" />
              {newCommentId === comment.id || editCommentId === comment.id ? (
                <textarea
                  style={{ marginTop: "0.25rem", width: "100%" }}
                  id={comment.id}
                  name={comment.id}
                  value={comment.value}
                  onChange={(e) =>
                    setValue(
                      e,
                      comment.id,
                      newCommentId === comment.id /* Là thêm mới? */
                    )
                  }
                  onKeyPress={(e) =>
                    handleKeyPress(
                      e,
                      comment.id,
                      newCommentId === comment.id /* Là thêm mới? */
                    )
                  }
                  autoFocus
                />
              ) : (
                <div
                  style={{ padding: "0.25rem", border: "1px solid #ccc" }}
                  onDoubleClick={() => setEditCommentId(comment.id)}
                >
                  {comment.description || "Nhấp đúp để chỉnh sửa..."}
                </div>
              )}
            </div>
            <div style={{ textAlign: "end" }}>
              <button onClick={() => addReply(comment.id)}>Reply</button>
              <button onClick={() => deleteComment(comment.id, comments)}>
                Delete
              </button>
              {editCommentId !== comment.id && (
                <button onClick={() => setEditCommentId(comment.id)}>
                  Edit
                </button>
              )}
            </div>
            {Array.isArray(comment.children) && comment.children.length > 0 && (
              <CommentBox
                comments={comment.children}
                onChange={onChange}
                level={level + 1}
              />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};
