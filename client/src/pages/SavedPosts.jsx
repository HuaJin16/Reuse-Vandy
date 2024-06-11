import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PostItem from "../components/PostItem";

export default function SavedPost() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [errors, setErrors] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  // fetches and sets the current user's saved posts on component mount
  useEffect(() => {
    const getSavedPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/user/savedPosts/${currentUser._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.postErrors) {
          setErrors(data.postErrors);
        } else {
          setSavedPosts(data.savedPosts);
        }
      } catch (err) {
        setErrors({ general: err });
      }
    };
    getSavedPosts();
  }, []);

  return (
    <div>
      <h2>Saved Posts</h2>
      <div>
        {errors.general || errors.posts ? (
          <span>{errors.general || errors.posts}</span>
        ) : (
          savedPosts.length > 0 &&
          savedPosts.map((post) => <PostItem key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}
