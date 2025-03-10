import React, { useState, useEffect } from "react";
import axios from "axios";

// Connect to backend server
const axios2 = axios.create({
  baseURL: "http://localhost:5001",
});

const UploadClothes = ({ setShowUploadModal, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

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
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.status === 200) {
        alert("Clothing uploaded successfully!");
        setShowUploadModal(false);
        onUploadSuccess(); 
      }
    } catch (error) {
      console.error("Upload failed:", error);
      console.error("Error details:", error.response?.data);
      alert("Upload failed. Try again: " + (error.response?.data?.error || error.message));
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => setShowUploadModal(false)}>✖</button>
        
        <h2 className="modal-title">Upload Clothing</h2>

        <label className="file-upload">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          Choose File
        </label>

        {image && <img src={image} alt="Preview" className="image-preview" />}

        <select 
          className="category-dropdown"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
          <option value="outerwear">Outerwear</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>

        <button 
          className="save-button"
          onClick={handleUpload} 
          disabled={loading}
        >
          {loading ? "Uploading..." : "Save to Wardrobe"}
        </button>
      </div>
    </div>
  );
};

export default UploadClothes;