import { Link } from "react-router-dom";
import { MdOutlineBookmarkAdd } from "react-icons/md";

export default function PostItem({ post }) {
  return (
    <div>
      <Link to={`/post/${post._id}`}>
        <img src={post.imageUrls[0]} alt="Post Image" />
        <div>
          <p>{post.title}</p>
          <p>{post.price}</p>
          <MdOutlineBookmarkAdd title="Saved" />
        </div>
      </Link>
    </div>
  );
}
