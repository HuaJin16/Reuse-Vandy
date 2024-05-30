import React from "react";
import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function New() {
  const [files, setFiles] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    imageUrls: [],
  });
  const [uploadError, setUploadError] = useState(false);
  const [createErrors, setCreateErrors] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; ++i) {
        promises.push(uploadImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploadError(false);
          setCreateErrors({ imageUrl: "" });
        })
        .catch((err) => {
          setUploadError("Image size exceeds the 2 MB limit");
        });
    } else if (files.length == 0) {
      setUploadError("Minimum of 1 image when uploading");
    } else {
      setUploadError("Maximum of 6 images per post");
    }
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
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
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setCreateErrors((prevCreateErrors) => ({
      ...prevCreateErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/post/new", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.postErrors) {
        setCreateErrors(data.postErrors);
      } else {
        setFormData({ type: "", price: "", description: "", imageUrls: [] });
        setFiles([]);
        setUploadPercentage(0);
        setUploadError(false);
        setCreateErrors({});
        navigate(`/post/${data._id}`);
      }
    } catch (err) {
      setCreateErrors({ general: err.message });
    }
  };

  return (
    <div>
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
            value={formData.title}
          />
          {createErrors.title && <span>{createErrors.title}</span>}
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
          />
          {createErrors.price && <span>{createErrors.price}</span>}
          <input
            type="text"
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={formData.description}
          />
          {createErrors.description && <span>{createErrors.description}</span>}
        </div>
        <div>
          <span>Images (max 6):</span>
          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            name="images"
            accept="image/*"
            multiple
          />
          <button type="button" onClick={handleImageUpload}>
            {uploadPercentage > 0 && uploadPercentage < 100
              ? `Uploading... ${uploadPercentage}%`
              : "Upload"}
          </button>
          {createErrors.imageUrls && <span>{createErrors.imageUrls}</span>}
          {uploadError && <span>{uploadError}</span>}
          {formData.imageUrls.map((url, index) => (
            <div key={index}>
              <img src={url} alt="uploaded" />
              <button onClick={() => handleRemoveImage(index)} type="button">
                Delete
              </button>
            </div>
          ))}
        </div>
        <button disabled={uploadPercentage > 0 && uploadPercentage < 100}>
          Create
        </button>
        {createErrors.general && <span>{createErrors.general}</span>}
      </form>
    </div>
  );
}