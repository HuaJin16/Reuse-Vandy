import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostItem from "../components/PostItem";
import { addSavedPost, clearSavedPosts } from "../redux/user/userSlice";

export default function SavedPost() {
  const [errors, setErrors] = useState({});
  const { currentUser, savedPosts } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // fetches and sets the current user's saved posts on component mount
  useEffect(() => {
    const getSavedPosts = async () => {
      try {
        dispatch(clearSavedPosts());
        const res = await fetch(
          `http://localhost:8000/user/savedPosts/${currentUser._id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.postErrors) {
          setErrors(data.postErrors);
        } else {
          data.savedPosts.forEach((post) => dispatch(addSavedPost(post)));
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
        ) : savedPosts.length === 0 ? (
          <span>No saved posts found</span>
        ) : (
          savedPosts.map((post) => (
            <PostItem
              key={post._id}
              post={post}
              isSaved={true}
              showImage={true}
            />
          ))
        )}
      </div>
    </div>
  );
}
