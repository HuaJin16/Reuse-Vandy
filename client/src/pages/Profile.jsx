import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { ImProfile } from "react-icons/im";
import { BsFileEarmarkPost } from "react-icons/bs";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { deleteUser, updateUser, logoutUser } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [showSection, setShowSection] = useState("posts");
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const handleSectionChange = (section) => {
    setShowSection(section);
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // create a root reference
    const storage = getStorage(app);
    // ensure each file name is unique
    const fileName = new Date().getTime() + file.name;
    // create a reference to the unique file name
    const storageRef = ref(storage, fileName);
    // upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        setErrors(UserData.authErrors);
      } else {
        setErrors({});
        dispatch(deleteUser(userData));
      }
    } catch (err) {
      setErrors({ auth: err.message });
    }
  };

  const handleUserLogout = async () => {
    try {
      const res = await fetch(`http://localhost:8000/auth/logout`);
      const userData = await res.json();
      if (userData.logoutErrors) {
        setErrors(userData.logoutErrors);
      } else {
        setErrors({});
        dispatch(logoutUser(userData));
      }
    } catch (err) {
      setErrors({ logout: err.message });
    }
  };

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

  return (
    <div>
      <h1>Your Profile</h1>
      <div>
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
        />
        {!isSubmitted && (
          <p>
            {uploadError ? (
              <span>
                Image upload error (file size or format may not be supported)
              </span>
            ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
              <span>{`Uploading... ${uploadPercentage}%`}</span>
            ) : uploadPercentage === 100 ? (
              <span>
                Image uploaded successfully (update in account tab to save
                avatar)
              </span>
            ) : (
              " "
            )}
          </p>
        )}
        <span>
          {currentUser.firstName} {currentUser.lastName}
        </span>
        <span>
          Joined on {new Date(currentUser.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div>
        <button onClick={() => handleSectionChange("posts")}>
          <BsFileEarmarkPost /> Posts
        </button>
        <button onClick={() => handleSectionChange("account")}>
          <ImProfile /> Account
        </button>
      </div>
      <div>
        {showSection === "posts" && (
          <div>
            <div>
              {userPosts &&
                userPosts.length > 0 &&
                userPosts.map((post) => (
                  <div key={post._id}>
                    <Link to={`/post/${post._id}`}>
                      <img src={post.imageUrls[0]} alt="post image" />
                    </Link>
                    <Link to={`/post/${post._id}`}>{post.title}</Link>
                    <div>
                      <button>Delete</button>
                      <button>Edit</button>
                    </div>
                  </div>
                ))}
            </div>
            {errors.posts && <span>{errors.posts}</span>}
            <button>
              <Link to="/new">New Post</Link>
            </button>
          </div>
        )}
        {showSection === "account" && (
          <div>
            <form onSubmit={handleSubmit}>
              <h2>Update one or all fields:</h2>
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
              <button type="submit">Update</button>
            </form>
            <div>
              <button onClick={handleDeleteUser}>Delete account</button>
              <button onClick={handleUserLogout}>Logout</button>
            </div>
            <div>
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
