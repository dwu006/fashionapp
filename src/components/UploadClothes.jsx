import React, { useState } from "react";
import axios from "axios";

//connect to backend server
const axios2 = axios.create({
  baseURL: 'http://localhost:5000'
});

const UploadClothes = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios2.post("/wardrobe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        alert("Image uploaded successfully!");
        setImage(null);
        setFile(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-clothes">
      {/* Upload button */}
      <label className="upload-label">
        Upload an Image
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      {image && (
        <div className="image-preview">
          <h3>Preview</h3>
          <img src={image} alt="Clothes" style={{ width: "100%", maxWidth: "100px" }} />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Uploading..." : "Upload to Wardrobe"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadClothes;
