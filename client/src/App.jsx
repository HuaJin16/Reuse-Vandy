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

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/access", "/login", "/register"];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/edit/:postId" element={<EditPost />} />
        </Route>
        <Route path="/access" element={<Access />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
}

export default App;
