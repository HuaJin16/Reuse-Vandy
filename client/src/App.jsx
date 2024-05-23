import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Access from "./pages/Access";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

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
        </Route>
        <Route path="/access" element={<Access />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
