import React from "react";

export default function New() {
  return (
    <div>
      <h1>New Post</h1>
      <form>
        <div>
          <input type="text" name="title" placeholder="Title" />
          <input type="text" name="price" placeholder="Price" />
          <input type="text" name="description" placeholder="Description" />
        </div>
        <div>
          <span>Images (max 6):</span>
          <div>
            <input type="file" name="images" accept="image/*" multiple />
            <button>Upload</button>
          </div>
        </div>
        <button>Create</button>
      </form>
    </div>
  );
}
