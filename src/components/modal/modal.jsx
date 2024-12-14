import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { PostsContext } from "../../context/postContext";
import * as Itemserver from "../../server/itemstore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ open, onClose, postId, ownerId, post }) => {
  const { currentUser } = useContext(AuthContext);
  const { setPostRegistrations } = useContext(PostsContext);

  const handleYesClick = async () => {
    const accessToken = JSON.parse(localStorage.getItem("access_token")); // Assuming accessToken is present in currentUser.data
    const userId = currentUser.data.id; // Thay thế bằng userId của người dùng cụ thể
    const limit = 3;
    const status = 1;
    const registrationData = {
      message: "Please give it for me",
      postId: postId, // Use the postId passed as a prop
    };

    const dataNofication = {
      userRid: ownerId,
      title: "register post",
      itemRid: postId,
      content: `${currentUser.data.username} đã đăng ký bài viết của bạn`, // Sửa lỗi ở đây
      typeCd: "1"
    };    

    try {
      await Itemserver.postRegistration(accessToken, registrationData);
      const result = await Itemserver.getPostRegistrationByUserId(
        accessToken,
        userId,
        limit,
        status
      );
      setPostRegistrations(result.listData)
      await Itemserver.createNoficationRegisPost(accessToken, dataNofication);
      toast.success("Registration successful");
      onClose();
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  if (!open) return null;
  return (
    <div onClick={onClose} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalContainer"
      >
        <img
          className="imgModal"
          src={post.image[0]?.url}
          alt="/"
        />
        <div className="modalRight">
          <p className="closeBtn" onClick={onClose}>
            X
          </p>
          <div className="content">
            <p>Do you want a</p>
            <h1>THIS PRODUCT</h1>
            <p>This is a great choice</p>
          </div>
          <div className="btnContainer">
            <button className="btnPrimary" onClick={handleYesClick}>
              <span className="bold">YES</span>, I Want it
            </button>
            <button className="btnOutline" onClick={onClose}>
              <span className="bold">NO</span>, thanks
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
