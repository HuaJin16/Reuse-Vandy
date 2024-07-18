import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { IoStorefrontOutline } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addSavedPost, removeSavedPost } from "../redux/user/userSlice";
import { io } from "socket.io-client";
import "../styles/Post.css";

export default function Post() {
  const [errors, setErrors] = useState({});
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const { currentUser, savedPosts } = useSelector((state) => state.user);
  const isSaved = post
    ? savedPosts.some((savedPost) => savedPost._id === post._id)
    : false;
  const dispatch = useDispatch();
  SwiperCore.use([Navigation]);

  useEffect(() => {
    // establish WebSocket connection
    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);
  }, []);

  // fetches and sets post data on mount or when postId changes
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/post/get/${params.postId}`
        );
        const data = await res.json();
        if (data.postErrors) {
          setErrors(data.postErrors);
        } else {
          setPost(data);
        }
      } catch (err) {
        setErrors({ general: err.message });
      }
    };
    getPost();
  }, [params.postId]);

  // fetches and sets the post user's information
  useEffect(() => {
    const getPostUser = async () => {
      if (post) {
        const res = await fetch(`http://localhost:8000/user/${post.userRef}`, {
          credentials: "include",
        });
        const userData = await res.json();
        if (userData.authErrors) {
          setErrors(userData.authErrors);
        } else {
          setPostUser(userData);
        }
      }
    };
    getPostUser();
  }, [post]);

  // fucntion to return an array of true checkbox inputs
  const getTrueCheckboxes = () => {
    const trueCheckboxes = Object.keys(post).filter(
      (key) => typeof post[key] === "boolean" && post[key] === true
    );
    return trueCheckboxes;
  };

  const getDisplayText = (key) => {
    const mapping = {
      tickets: "Tickets",
      clothes: "Clothes",
      merch: "Merch",
      electronics: "Electronics",
      furniture: "Furniture",
      housing: "Housing",
      books: "Books",
      miscellaneous: "Miscellaneous",
      new: "New",
      lightlyUsed: "Lightly Used",
      used: "Used",
      obo: "OBO",
      free: "Free",
    };
    return mapping[key];
  };

  // function to update URL with clicked category and navigate to search results page
  const handleCategoryClick = (category) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("category", category.toLowerCase());
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // function to save or unsave a post for the current user
  const handleSaveUnsave = async () => {
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
        setErrors(data.postErrors);
      } else {
        if (isSaved) {
          dispatch(removeSavedPost(post._id));
          socket.emit("post_unsave");
        } else {
          dispatch(addSavedPost(post));
          socket.emit("post_save");
        }
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="post-container">
      {(errors.posts || errors.auth || errors.general) &&
        (errors.posts || errors.auth || errors.general)}
      {post && postUser && (
        <div className="single-post">
          <div
            className="postUser-info"
            onClick={() => {
              postUser._id === currentUser._id
                ? navigate("/profile")
                : navigate(`/user/${postUser._id}`);
            }}
          >
            <img
              src={postUser.avatar}
              alt="post-user"
              className="postUser-avatar"
            />
            <span className="postUser-name">
              {postUser.firstName} {postUser.lastName}
            </span>
          </div>
          <div className="post-images">
            {post.imageUrls.length > 1 ? (
              <Swiper navigation>
                {post.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <img src={url} alt="post image" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="single-image-container">
                <img src={post.imageUrls[0]} alt="post image" />
              </div>
            )}
          </div>
          <div className="post-details">
            <p className="single-post-title">{post.title}</p>
            <p className="single-post-price">${post.price}</p>
            <div className="post-attributes">
              {getTrueCheckboxes().length > 0 ? (
                getTrueCheckboxes().map((key) => (
                  <span
                    key={key}
                    className="single-post-attribute"
                    onClick={() => handleCategoryClick(getDisplayText(key))}
                  >
                    {getDisplayText(key)}
                  </span>
                ))
              ) : (
                <span className="single-post-none">
                  No categories or tags selected
                </span>
              )}
            </div>
            <p className="single-post-description">{post.description}</p>
            <p className="single-post-date">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {postUser._id !== currentUser._id && (
              <div className="post-buttons">
                <button onClick={() => handleSaveUnsave()}>
                  {isSaved ? (
                    <span>
                      <IoStorefrontOutline /> Unsave
                    </span>
                  ) : (
                    <span>
                      <IoStorefrontOutline /> Save
                    </span>
                  )}
                </button>
                <Link
                  to={`/message/${post.userRef}`}
                  className="single-post-link"
                >
                  <button>
                    <BiMessageDetail /> Message
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
