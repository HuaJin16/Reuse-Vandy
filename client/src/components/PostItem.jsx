import { Link } from "react-router-dom";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { useSelector } from "react-redux";

export default function PostItem({ post }) {
  const { currentUser } = useSelector((state) => state.user);

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
        console.log("Error saving/unsaving post", err);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log("Error saving/unsaving post", err);
    }
  };

  return (
    <div>
      <Link to={`/post/${post._id}`}>
        <img src={post.imageUrls[0]} alt="Post Image" />
        <div>
          <p>{post.title}</p>
          <p>{post.price}</p>
        </div>
      </Link>
      <MdOutlineBookmarkAdd title="Saved" onClick={handleSaveUnsavePost} />
    </div>
  );
}
