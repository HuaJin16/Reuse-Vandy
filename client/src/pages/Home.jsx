import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Home() {
  const [newestPosts, setNewestPosts] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const getNewestPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/post/get?limit=6`);
        const data = await res.json();
        setNewestPosts(data.posts);
      } catch (err) {
        console.log(err);
      }
    };
    getNewestPosts();
  }, []);

  return (
    <div>
      <div>
        <img
          src="https://admissions.vanderbilt.edu/wp-content/uploads/sites/4/2021/06/20181108JR003-scaled.jpg"
          alt="Vanderbilt University"
        />
        <h1>Vanderbilt's Marketplace for Second-Hand Goods </h1>
        <Link to={"/search"}>Discover Now</Link>
      </div>
      <div>
        <h1>Newest Posts</h1>
        <Swiper navigation>
          {newestPosts.length > 0 &&
            newestPosts.map((post) => (
              <SwiperSlide key={post._id}>
                <div>
                  <p>{post.title}</p>
                  <p>${post.price}</p>
                  <p>{post.description}</p>
                  <p>
                    Posted on {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <img src={post.imageUrls[0]} alt="post image" />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}
