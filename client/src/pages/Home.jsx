import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import "../styles/Home.css";

export default function Home() {
  const [newestPosts, setNewestPosts] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const getNewestPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/post/get?limit=12`);
        const data = await res.json();
        // filter out the current user's posts
        const filteredPosts = data.posts.filter(
          (post) => post.userRef !== currentUser._id
        );
        setNewestPosts(filteredPosts);
      } catch (err) {
        console.log(err);
      }
    };
    getNewestPosts();
  }, []);

  // function to group posts into arrays of 3
  const groupPosts = (posts, groupSize = 3) => {
    const groupedPosts = [];
    for (let i = 0; i < posts.length; i += groupSize) {
      groupedPosts.push(posts.slice(i, i + groupSize));
    }
    return groupedPosts;
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-container">
          <img
            src="https://www.commonapp.org/static/f14242e1e38d8f02ce26ed9f5e57c371/vanderbilt-university_277.jpg"
            alt="Vanderbilt University"
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Vanderbilt's Marketplace for Second-Hand Goods
          </h1>
          <Link to={"/search"} className="hero-link">
            Discover Now
          </Link>
        </div>
      </div>
      <div className="home-newest">
        <h1 className="newest-title">Newest Posts</h1>
        <Swiper navigation className="home-swiper">
          {newestPosts.length === 0 ? (
            <span className="home-none">No posts found</span>
          ) : (
            groupPosts(newestPosts).map((group, index) => (
              <SwiperSlide key={index} className="home-slide">
                {group.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="home-link"
                  >
                    <div className="home-image-container">
                      <img
                        src={post.imageUrls[0]}
                        alt="post image"
                        className="home-image"
                      />
                      <p className="home-price">${post.price}</p>
                    </div>
                    <div className="home-content">
                      <p className="home-title">{post.title}</p>
                    </div>
                  </Link>
                ))}
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
}
