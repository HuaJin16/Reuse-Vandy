import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { ImProfile } from "react-icons/im";
import { BsFileEarmarkPost } from "react-icons/bs";
import { VscNewFile } from "react-icons/vsc";
import { RxUpdate } from "react-icons/rx";
import { FaTrashCan } from "react-icons/fa6";
import { RiLogoutBoxRLine } from "react-icons/ri";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { deleteUser, updateUser, logoutUser } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [showSection, setShowSection] = useState("posts");
  const [file, setFile] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSectionChange = (section) => {
    setShowSection(section);
  };

  // calls handleFileUpload whenever the file variable changes
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // function to upload a file to a Firebase storage
  const handleFileUpload = (file) => {
    const storage = getStorage(app); // create a root reference
    const fileName = new Date().getTime() + file.name; // ensure each file name is unique
    const storageRef = ref(storage, fileName); // create a reference to the unique file name
    const uploadTask = uploadBytesResumable(storageRef, file); // upload the file

    // monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
      },
      (error) => {
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  // function to handle input change and update form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // function to submit updated user data to the server and update Redux state
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/user/update/${currentUser._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const userData = await res.json();
      if (userData.authErrors) {
        setErrors(userData.authErrors);
      } else {
        setFormData({});
        setErrors({});
        dispatch(updateUser(userData));
        setUpdateSuccess(true);
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrors({ auth: err.message });
      setUpdateSuccess(false);
    }
  };

  // function to delete the current user's account and set Redux state to null
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const userData = await res.json();
      if (userData.authErrors) {
        setErrors(userData.authErrors);
      } else {
        setErrors({});
        dispatch(deleteUser(userData));
        navigate("/access");
      }
    } catch (err) {
      setErrors({ auth: err.message });
    }
  };

  // function to log out the current user and set Redux state to null
  const handleUserLogout = async () => {
    try {
      const res = await fetch(`http://localhost:8000/auth/logout`);
      const userData = await res.json();
      if (userData.logoutErrors) {
        setErrors(userData.logoutErrors);
      } else {
        setErrors({});
        dispatch(logoutUser(userData));
        navigate("/access");
      }
    } catch (err) {
      setErrors({ logout: err.message });
    }
  };

  // function to fetch and display the current user's posts
  const showPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/user/posts/${currentUser._id}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.postErrors) {
        setErrors(data.postErrors);
      } else {
        setUserPosts(data);
        setErrors({ posts: "", auth: "" });
      }
    } catch (err) {
      setErrors({ posts: err.message });
    }
  };

  // useEffect hook to fetch user's posts when the "post" section is shown
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await showPosts();
      } catch (err) {
        setErrors({ posts: err.message });
      }
    };

    if (showSection === "posts") {
      fetchPosts();
    }
  }, [showSection]);

  // function to delete a user's post on the server and remove it from local state
  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8000/post/delete/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.postErrors) {
        setErrors(data.postErrors);
      } else {
        setErrors({ posts: "" });
        // remove the post from the database by comparing post and requested ID's
        setUserPosts((prev) => prev.filter((post) => post._id !== postId));
      }
    } catch (err) {
      setErrors({ posts: err.message });
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>
      <div className="profile-header">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="avatar"
          className="profile-avatar-image"
        />
        <div className="profile-info">
          <span className="profile-page-name">
            {currentUser.firstName} {currentUser.lastName}
          </span>
          <span className="profile-joined-date">
            Joined on {new Date(currentUser.createdAt).toLocaleDateString()}
          </span>
          {!isSubmitted && (
            <p className="profile-upload-status">
              {uploadError ? (
                <span className="upload-fail">
                  Image upload error (file size or format may not be supported)
                </span>
              ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
                <span>{`Uploading... ${uploadPercentage}%`}</span>
              ) : uploadPercentage === 100 ? (
                <span className="upload-success">
                  Image uploaded successfully (update in account tab to save
                  avatar)
                </span>
              ) : (
                " "
              )}
            </p>
          )}
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-nav">
          <button
            onClick={() => handleSectionChange("posts")}
            className="profile-nav-button"
          >
            <BsFileEarmarkPost /> Posts
          </button>
          <button
            onClick={() => handleSectionChange("account")}
            className="profile-nav-button"
          >
            <ImProfile /> Account
          </button>
        </div>
        {showSection === "posts" && (
          <div className="profile-posts">
            {userPosts &&
              userPosts.length > 0 &&
              userPosts.map((post) => (
                <div key={post._id} className="profile-single-post">
                  <Link
                    to={`/post/${post._id}`}
                    className="profile-image-container"
                  >
                    <img src={post.imageUrls[0]} alt="post image" />
                  </Link>
                  <Link to={`/post/${post._id}`} className="profile-post-title">
                    {post.title}
                  </Link>
                  <div className="post-actions">
                    <button onClick={() => handleDeletePost(post._id)}>
                      Delete
                    </button>
                    <Link to={`/edit/${post._id}`}>
                      <button>Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            {errors.posts && <span>{errors.posts}</span>}
          </div>
        )}
        {showSection === "posts" && (
          <button className="new-post-button">
            <Link to="/new">
              <VscNewFile /> New Post
            </Link>
          </button>
        )}
        {showSection === "account" && (
          <div className="profile-account">
            <form onSubmit={handleSubmit} className="update-form">
              <h2 className="update-title">Update one or more fields:</h2>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <button type="submit">
                <RxUpdate /> Update
              </button>
            </form>
            <div className="account-actions">
              <button onClick={handleDeleteUser}>
                <FaTrashCan /> Delete account
              </button>
              <button onClick={handleUserLogout}>
                <RiLogoutBoxRLine /> Logout
              </button>
            </div>
            <div className="profile-errors">
              {(errors.password ||
                errors.auth ||
                errors.logout ||
                errors.posts ||
                updateSuccess) && (
                <span>
                  {errors.password
                    ? errors.password
                    : errors.auth
                    ? errors.auth
                    : errors.logout
                    ? errors.logout
                    : errors.posts
                    ? errors.posts
                    : updateSuccess
                    ? "User updated successfully"
                    : null}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
