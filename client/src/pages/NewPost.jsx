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
import CheckboxInput from "../components/CheckboxInput";
import "../styles/NewPost.css";

export default function NewPost() {
  const [files, setFiles] = useState([]);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    imageUrls: [],
    tickets: false,
    clothes: false,
    merch: false,
    electronics: false,
    furniture: false,
    housing: false,
    books: false,
    miscellaneous: false,
    new: false,
    lightlyUsed: false,
    used: false,
    obo: false,
    free: false,
  });
  const [uploadError, setUploadError] = useState(false);
  const [createErrors, setCreateErrors] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // function that manages the process of uploading images for a post
  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; ++i) {
        promises.push(uploadImage(files[i]));
      }
      // Updates form data after all image uploads are resolved
      Promise.all(promises)
        // urls represent the successfully uploaded images
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

  // function to remove an image URL from formData state based on the provided index
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  // function to update form data and clear corresonding error states on input changes
  const handleChange = (e) => {
    const { type, name, checked, value } = e.target;
    const isCheckbox = type === "checkbox";
    // ensure only one condition can be checked at a time
    if (name === "new" || name === "lightlyUsed" || name === "used") {
      setFormData({
        ...formData,
        new: name === "new" ? checked : false,
        lightlyUsed: name === "lightlyUsed" ? checked : false,
        used: name === "used" ? checked : false,
      });
    }
    // ensure only one of "obo" or "free" can be checked at a time
    else if (name === "obo" || name === "free") {
      setFormData({
        ...formData,
        obo: name === "obo" ? checked : false,
        free: name === "free" ? checked : false,
      });
    } else {
      setFormData({
        ...formData,
        [name]: isCheckbox ? checked : value,
      });
    }

    setCreateErrors((prevCreateErrors) => ({
      ...prevCreateErrors,
      [e.target.name]: "",
    }));
  };

  // function to submit newly created post data to the server
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
        setFormData({
          type: "",
          price: "",
          description: "",
          imageUrls: [],
          tickets: false,
          clothes: false,
          merch: false,
          electronics: false,
          furniture: false,
          housing: false,
          books: false,
          miscellaneous: false,
          new: false,
          lightlyUsed: false,
          used: false,
          obo: false,
          free: false,
        });
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

  // function to get the label text for a given key
  const getDisplayText = (key) => {
    const mapping = {
      tickets: "Tickets",
      clothes: "Clothes",
      merch: "Merch",
      electronics: "Electronics",
      furniture: "Furniture",
      housing: "Housing",
      books: "Books",
      miscellaneous: "Miscellaneous",
      new: "New",
      lightlyUsed: "Lightly Used",
      used: "Used",
      obo: "OBO",
      free: "Free",
    };
    return mapping[key];
  };

  const categories = [
    "tickets",
    "clothes",
    "merch",
    "electronics",
    "furniture",
    "housing",
    "books",
    "miscellaneous",
  ];

  const tags = ["new", "lightlyUsed", "used", "obo", "free"];

  // function to display categories and tags as checkbox inputs
  const renderCheckboxes = (keys) => {
    return keys.map((key) => (
      <CheckboxInput
        key={key}
        label={getDisplayText(key)}
        name={key}
        value={key}
        checked={formData[key]}
        onChange={handleChange}
      />
    ));
  };

  return (
    <div className="newPost-container">
      <h1 className="newPost-title">New Post</h1>
      <form onSubmit={handleSubmit} className="newPost-form">
        <div className="form-container">
          <h2 className="form-container-title">Details:</h2>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={formData.title}
              className="form-input"
            />
            {createErrors.title && (
              <span className="form-error-message">{createErrors.title}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              value={formData.price}
              className="form-input"
            />
            {createErrors.price && (
              <span className="form-error-message">{createErrors.price}</span>
            )}
          </div>
          <div className="form-group">
            <textarea
              type="text"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
              className="form-textArea"
            />
            {createErrors.description && (
              <span className="form-error-message">
                {createErrors.description}
              </span>
            )}
          </div>
        </div>
        <div className="form-container">
          <h2 className="form-container-title">Images (max 6):</h2>
          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            name="images"
            accept="image/*"
            multiple
          />
          {createErrors.imageUrls && <span>{createErrors.imageUrls}</span>}
          {uploadError && <span className="upload-error">{uploadError}</span>}
          <div className="image-preview-container">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt="uploaded" className="preview-image" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="delete-image-button"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleImageUpload}
            className="form-upload-button"
          >
            {uploadPercentage > 0 && uploadPercentage < 100
              ? `Uploading... ${uploadPercentage}%`
              : "Upload"}
          </button>
        </div>
        <div className="form-container">
          <div className="checkbox-container">
            <h2 className="form-container-title">Categories:</h2>
            <div className="checkbox-group">{renderCheckboxes(categories)}</div>
            <h2 className="form-container-title">Tags:</h2>
            <div className="checkbox-group">{renderCheckboxes(tags)}</div>
          </div>
        </div>
        <div className="form-container">
          <button
            disabled={uploadPercentage > 0 && uploadPercentage < 100}
            className="newPost-create-button"
          >
            Create
          </button>
          {createErrors.general && (
            <span className="newPost-error-message">
              {createErrors.general}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
