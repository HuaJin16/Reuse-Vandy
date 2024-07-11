import { Link } from "react-router-dom";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdOutlineBookmarkRemove } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { addSavedPost, removeSavedPost } from "../redux/user/userSlice";
import "../styles/PostItem.css";

export default function PostItem({ post, isSaved, showImage }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // function to save or unsave a post for the current user
  const handleSaveUnsavePost = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/user/saveUnsave/${currentUser._id}/${post._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.postErrors) {
        console.log("Error saving/unsaving post", data.postErrors);
      } else {
        if (isSaved) {
          dispatch(removeSavedPost(post._id));
        } else {
          dispatch(addSavedPost(post));
        }
      }
    } catch (err) {
      console.log("Error saving/unsaving post", err);
    }
  };

  return (
    <div className="post-item-container">
      <Link to={`/post/${post._id}`} className="post-link">
        {showImage && (
          <img
            src={post.imageUrls[0]}
            alt="Post Image"
            className="post-image"
          />
        )}
        <div className="post-details">
          <p className="post-title">{post.title}</p>
          <p className="post-price">${post.price}</p>
        </div>
      </Link>
      <button
        className="save-button"
        onClick={handleSaveUnsavePost}
        title={isSaved ? "Unsave" : "Save"}
      >
        {isSaved ? <MdOutlineBookmarkRemove /> : <MdOutlineBookmarkAdd />}
      </button>
    </div>
  );
}
