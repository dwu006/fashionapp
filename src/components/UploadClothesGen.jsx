import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UploadClothes.css";

// Connect to backend server with correct port
const axios2 = axios.create({
  baseURL: "http://localhost:5001",
});

const UploadClothesGen = ({ setShowUploadModal, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:5001/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data._id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedCategory) {
      alert("Please select an image and category!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", selectedCategory);

    try {
      console.log("Uploading with category:", selectedCategory);
      const response = await axios2.post("/wardrobe/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setShowUploadModal(false);
        onUploadSuccess(file, selectedCategory); // Pass the File object, not the Blob URL
      }
    } catch (error) {
      console.error("Upload failed:", error);
      console.error("Error details:", error.response?.data);
      alert("Upload failed. Try again: " + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
      <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="upload-close-button" onClick={() => setShowUploadModal(false)}>×</button>

        <h2 className="upload-modal-title">Add to Your Wardrobe</h2>

        <div
          className={`drop-area ${dragActive ? 'drag-active' : ''} ${image ? 'has-image' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {image ? (
            <div className="image-preview-container">
              <img src={image} alt="Preview" className="upload-image-preview" />
              <button
                className="remove-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setFile(null);
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="drop-text">Drag & drop your photo here or</p>
              <label className="upload-file-btn">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                Browse Files
              </label>
              <p className="file-support-text">Supports: JPG, PNG, GIF (Max 5MB)</p>
            </>
          )}
        </div>

        <div className="upload-category-section">
          <label className="category-label">Category:</label>
          <div className="category-buttons">
            {['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessories', 'Other'].map((category) => (
              <button
                key={category}
                type="button"
                className={`category-select-btn ${selectedCategory === category.toLowerCase() ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          className={`upload-save-button ${(!file || !selectedCategory || loading) ? 'disabled' : ''}`}
          onClick={handleUpload}
          disabled={!file || !selectedCategory || loading}
        >
          {loading ? (
            <div className="loader"></div>
          ) : (
            "Add to Wardrobe"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadClothesGen;