import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Access from "./pages/Access";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import Search from "./pages/Search";
import SavedPosts from "./pages/SavedPosts";
import Notifications from "./pages/Notifications";
import CategoryButtons from "./components/CategoryButtons";
import Message from "./pages/Message";
import MessagesList from "./pages/MessagesList";
import UserProfile from "./pages/UserProfile";

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/access", "/login", "/register"];
  const isSearchPage = location.pathname === "/search";

  return (
    <div className="app-container">
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      {!hideHeaderRoutes.includes(location.pathname) && <CategoryButtons />}
      <div className={`page-content ${isSearchPage ? "search-page" : ""}`}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new" element={<NewPost />} />
            <Route path="/edit/:postId" element={<EditPost />} />
            <Route path="/saved" element={<SavedPosts />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/message/:recipientId" element={<Message />} />
            <Route path="/messages" element={<MessagesList />} />
            <Route path="/user/:userId" element={<UserProfile />} />
          </Route>
          <Route path="/access" element={<Access />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
