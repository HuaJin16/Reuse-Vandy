import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Access from "./pages/Access";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import NewPost from "./pages/NewPost";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <>
                <Header /> <Home />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header /> <Profile />
              </>
            }
          />
          <Route
            path="/new"
            element={
              <>
                <Header /> <NewPost />
              </>
            }
          />
          <Route
            path="/edit/:postId"
            element={
              <>
                <Header /> <EditPost />
              </>
            }
          />
        </Route>
        <Route path="/access" element={<Access />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
