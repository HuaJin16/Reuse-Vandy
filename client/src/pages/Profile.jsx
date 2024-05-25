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

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [showSection, setShowSection] = useState("posts");
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
        <p>
          {uploadError ? (
            <span>
              Image upload error (file size or format may not be supported)
            </span>
          ) : uploadPercentage > 0 && uploadPercentage < 100 ? (
            <span>{`Uploading... ${uploadPercentage}%`}</span>
          ) : uploadPercentage === 100 ? (
            <span>
              Image uploaded successfully (update in account tab to save avatar)
            </span>
          ) : (
            " "
          )}
        </p>
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
        {showSection === "posts" && <h2>Your Posts</h2>}
        {showSection === "account" && (
          <form>
            <input type="text" name="firstName" placeholder="First name" />
            <input type="text" name="lastName" placeholder="Last name" />
            <input type="text" name="password" placeholder="Password" />
            <button>Update</button>
          </form>
        )}
      </div>
    </div>
  );
}
