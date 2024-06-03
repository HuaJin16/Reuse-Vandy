import React from "react";
import { useState, useEffect } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
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
  const params = useParams();

  // function to retrieve information for the selected post when the page loads
  useEffect(() => {
    const getPost = async () => {
      const postId = params.postId;
      const res = await fetch(`http://localhost:8000/post/get/${postId}`);
      const data = await res.json();
      if (data.postErrors) {
        console.log(data.message);
      } else {
        setFormData(data);
      }
    };
    getPost();
  }, []);

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

  // function to upload an image to Firebase storage
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setCreateErrors((prevCreateErrors) => ({
      ...prevCreateErrors,
      [e.target.name]: "",
    }));
  };

  // function to submit updated post data to the server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/post/edit/${params.postId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );
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
      <h1>Edit Post</h1>
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
          Edit
        </button>
        {createErrors.general && <span>{createErrors.general}</span>}
      </form>
    </div>
  );
}
