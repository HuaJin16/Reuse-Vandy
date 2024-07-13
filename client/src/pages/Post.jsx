import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { IoStorefrontOutline } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import "../styles/Post.css";

export default function Post() {
  const [errors, setErrors] = useState({});
  const [post, setPost] = useState(null);
  const [postUser, setPostUser] = useState(null);
  const params = useParams();
  SwiperCore.use([Navigation]);

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

  return (
    <div className="post-container">
      {(errors.posts || errors.auth || errors.general) &&
        (errors.posts || errors.auth || errors.general)}
      {post && postUser && (
        <div className="single-post">
          <div className="postUser-info">
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
              {getTrueCheckboxes().map((key) => (
                <span key={key} className="single-post-attribute">
                  {getDisplayText(key)}
                </span>
              ))}
            </div>
            <p className="single-post-description">{post.description}</p>
            <p className="single-post-date">
              Posted on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <button>
              <IoStorefrontOutline /> Reserve
            </button>
            <Link to={`/message/${post.userRef}`} className="single-post-link">
              <button>
                <BiMessageDetail /> Message
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
