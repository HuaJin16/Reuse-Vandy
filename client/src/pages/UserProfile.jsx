import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PostItem from "../components/PostItem";
import "../styles/UserProfile.css";

export default function UserProfile() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [errors, setErrors] = useState({});
  const { savedPosts } = useSelector((state) => state.user);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        // fetch user's data
        const userRes = await fetch(`http://localhost:8000/user/${userId}`, {
          credentials: "include",
        });
        const userData = await userRes.json();
        if (userData.authErrors) {
          setErrors(userData.authErrors);
        } else {
          setProfileUser(userData);
        }

        // fetch user's posts
        const postsRes = await fetch(
          `http://localhost:8000/user/posts/${userId}`,
          { credentials: "include" }
        );
        const postsData = await postsRes.json();
        if (postsData.postErrors) {
          setErrors(postsData.postErrors);
        } else {
          setPosts(postsData);
        }
      } catch (err) {
        console.log(err);
        setErrors({ general: err.message });
      }
    };
    getProfileData();
  }, [userId]);

  if (errors.auth || errors.post || errors.general) {
    return <div>{errors.auth || errors.post || errors.general}</div>;
  }

  return (
    <div className="userProfile-container">
      {profileUser && (
        <div>
          <div className="userProfile-header">
            <img
              src={profileUser.avatar}
              alt="profile avatar"
              className="userProfile-avatar"
            />
            <div className="userProfile-details">
              <h1 className="userProfile-name">
                {profileUser.firstName} {profileUser.lastName}
              </h1>
              <span className="userProfile-joined">
                Joined on {new Date(profileUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <h2 className="userProfile-title">Posts</h2>
          <div className="userProfile-list">
            {posts.length === 0 ? (
              <p className="userProfile-none">No posts found</p>
            ) : (
              posts.map((post) => (
                <PostItem
                  key={post._id}
                  post={post}
                  isSaved={savedPosts.some(
                    (savedPost) => savedPost._id === post._id
                  )}
                  showImage={true}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
