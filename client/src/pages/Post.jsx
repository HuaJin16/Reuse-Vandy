import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { IoStorefrontOutline } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";

export default function Post() {
  const [errors, setErrors] = useState({});
  const [post, setPost] = useState(null);
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

  return (
    <div>
      {(errors.posts || errors.general) && (errors.posts || errors.general)}
      {post && errors !== "" && (
        <div>
          <Swiper navigation>
            {post.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <img src={url} alt="post image" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div>
            <p>{post.title}</p>
            <p>${post.price}</p>
            <p>{post.description}</p>
            <p>Posted on {new Date(post.createdAt).toLocaleDateString()}</p>
            <button>
              <IoStorefrontOutline /> Reserve
            </button>
            <button>
              <BiMessageDetail /> Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
