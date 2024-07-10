import { Link } from "react-router-dom";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdOutlineBookmarkRemove } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { addSavedPost, removeSavedPost } from "../redux/user/userSlice";

export default function PostItem({ post, isSaved, showImage }) {
  const { currentUser, savedPosts } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isPostSaved = savedPosts.some(
    (savedPost) => savedPost._id === post._id
  );

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
        if (isPostSaved) {
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
    <div>
      <Link to={`/post/${post._id}`}>
        {showImage && <img src={post.imageUrls[0]} alt="Post Image" />}
        <div>
          <p>{post.title}</p>
          <p>{post.price}</p>
        </div>
      </Link>
      {isSaved ? (
        <MdOutlineBookmarkRemove
          title="Unsave"
          onClick={handleSaveUnsavePost}
        />
      ) : (
        <MdOutlineBookmarkAdd title="Save" onClick={handleSaveUnsavePost} />
      )}
    </div>
  );
}
