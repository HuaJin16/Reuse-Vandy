import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../components/PostItem";

export default function () {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "createdAt",
    order: "desc",
  });
  const [posts, setPosts] = useState([]);
  const [postRange, setPostRange] = useState("");
  const navigate = useNavigate();

  // function to handle input changes to update sidebarData
  const handleChange = (e) => {
    if (e.target.name === "search") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.name === "sortOrder") {
      const [sort, order] = e.target.value.split("_");
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  // function to navigate to search page with updated query parameters
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    // initialize and update sidebarData from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const sortUrl = urlParams.get("sort");
    const orderUrl = urlParams.get("order");

    if (searchTermUrl || sortUrl || orderUrl) {
      setSidebarData({
        searchTerm: searchTermUrl || "",
        sort: sortUrl || "createdAt",
        order: orderUrl || "desc",
      });
    }

    // fetch posts from the server based on current URL parameters
    const getPosts = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`http://localhost:8000/post/get?${searchQuery}`);
      const data = await res.json();
      setPosts(data.posts);
      setPostRange(data.postRange);
    };

    getPosts();
    // run whenever the URL search query changes or the component mounts
  }, [window.location.search]);

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <p>{postRange}</p>
          </div>
          <div>
            <label>Search Term:</label>
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Sort:</label>
            <select
              name="sortOrder"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value="price_desc">Price: Low to High</option>
              <option value="price_asc">Price: High to Low</option>
              <option value="createdAt_desc">Newest Posts</option>
              <option value="createdAt_asc">Oldest Posts</option>
            </select>
          </div>
          <button>Search</button>
        </form>
      </div>
      <div>
        <h1>Post Results</h1>
        <div>
          {posts.length === 0 && <p>No posts found</p>}{" "}
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
