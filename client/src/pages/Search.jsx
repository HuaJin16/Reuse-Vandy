import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostItem from "../components/PostItem";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import CheckboxInput from "../components/CheckboxInput";
import { useSelector } from "react-redux";

export default function () {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "createdAt",
    order: "desc",
    category: "",
    tags: [],
  });
  const [posts, setPosts] = useState([]);
  const [postRange, setPostRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { savedPosts } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const tags = ["new", "lightlyUsed", "used", "obo", "free"];

  const getDisplayText = (key) => {
    const mapping = {
      new: "New",
      lightlyUsed: "Lightly Used",
      used: "Used",
      obo: "OBO",
      free: "Free",
    };
    return mapping[key];
  };

  // function to handle input changes to update sidebarData
  const handleChange = (e) => {
    if (e.target.name === "search") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.name === "category") {
      setSidebarData({ ...sidebarData, category: e.target.value });
    }

    if (e.target.name === "tags") {
      const tag = e.target.value;
      const checked = e.target.checked;

      // only add the tag if the checkbox is selected
      if (checked) {
        // add the new tag to the existing tags array, or start a new array if empty.
        setSidebarData({
          ...sidebarData,
          tags:
            sidebarData.tags && sidebarData.tags.length > 0
              ? [...sidebarData.tags, tag]
              : [tag],
        });
      }
      // remove the unselected tag from the tags array
      else {
        const updatedTags = sidebarData.tags.filter(
          (filteredTag) => filteredTag != tag
        );
        setSidebarData({ ...sidebarData, tags: updatedTags });
      }
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
    urlParams.set("category", sidebarData.category);
    urlParams.set("tags", sidebarData.tags);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    // initialize and update sidebarData from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const sortUrl = urlParams.get("sort");
    const orderUrl = urlParams.get("order");
    const categoryUrl = urlParams.get("category");
    const tagsUrl = urlParams.get("tags");

    if (searchTermUrl || sortUrl || orderUrl || categoryUrl || tagsUrl) {
      setSidebarData({
        searchTerm: searchTermUrl || "",
        sort: sortUrl || "createdAt",
        order: orderUrl || "desc",
        category: categoryUrl || "",
        tags: tagsUrl ? tagsUrl.split(",") : [],
      });
    }

    // fetch posts from the server based on current URL parameters
    const getPosts = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `http://localhost:8000/post/get?${searchQuery}&page=${currentPage}`
      );
      const data = await res.json();
      setPosts(data.posts);
      setPostRange(data.postRange);
      setTotalPages(data.totalPages);
    };

    getPosts();
    // run whenever the URL search query changes or the component mounts
  }, [window.location.search, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
            <label>Category:</label>
            <select
              name="category"
              onChange={handleChange}
              value={sidebarData.category}
            >
              <option value="">All Categories</option>
              <option value="tickets">Tickets</option>
              <option value="clothes">Clothes</option>
              <option value="merch">Merch</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="housing">Housing</option>
              <option value="books">Books</option>
              <option value="miscellaneous">Miscellaneous</option>
            </select>
          </div>
          <div>
            <label>Tags:</label>
            {tags.map((key) => (
              <CheckboxInput
                key={key}
                label={getDisplayText(key)}
                name="tags"
                value={key}
                onChange={handleChange}
                checked={sidebarData.tags.includes(key)}
              />
            ))}
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
            <PostItem
              key={post._id}
              post={post}
              isSaved={savedPosts.some(
                (savedPost) => savedPost._id === post._id
              )}
              showImage={true}
            />
          ))}
        </div>
        <div>
          {posts.length !== 0 && (
            <div>
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                <GrFormPreviousLink /> Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next <GrFormNextLink />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
