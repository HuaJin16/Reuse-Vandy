import { useNavigate } from "react-router-dom";
import "../styles/CategoryButtons.css";

export default function CategoryButtons() {
  const navigate = useNavigate();
  const categories = [
    "Tickets",
    "Clothes",
    "Merch",
    "Electronics",
    "Furniture",
    "Housing",
    "Books",
    "Miscellaneous",
  ];

  // function to update URL with clicked category and navigate to search results page
  const handleCategoryClick = (category) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("category", category.toLowerCase());
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="categories-container">
      {categories.map((category) => (
        <button
          onClick={() => handleCategoryClick(category)}
          key={category}
          className="category-button"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
