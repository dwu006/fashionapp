import React, { useState, useEffect } from "react";
import axios from "axios";

// Connect to backend server
const axios2 = axios.create({
  baseURL: "http://localhost:5000",
});

const UploadClothes = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch user profile to get user ID when component mounts
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/profile", {
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];

    // Clear previous image and file
    setImage(null);
    setFile(null);

    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        alert("Upload an image");
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        alert("Error reading file");
        setImage(null);
        setFile(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Select an image");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category for your item");
      return;
    }

    if (!userId) {
      alert("Please log in to upload clothes");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", selectedCategory);

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      console.log("Uploading with category:", selectedCategory);

      const response = await axios2.post("/wardrobe/upload", formData, config);

      if (response.status === 200) {
        // Clear form
        setImage(null);
        setFile(null);
        setSelectedCategory(null);

        // Notify parent to refresh wardrobe
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Error details:", error.response?.data);
      alert(
        "Failed to upload image: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-clothes">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
        id="file-upload"
      />

      {/* Styled label as button */}
      <label htmlFor="file-upload" className="upload-clothing-button">
        Upload Clothing
      </label>

      {image && (
        <div className="image-preview">
          <img src={image} alt="Clothes" className="image-preview-img" />

          {/* Category Selection Buttons */}
          <div className="category-buttons">
            {[
              "top",
              "bottom",
              "outerwear",
              "shoes",
              "accessories",
              "other",
            ].map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category ? null : category
                  )
                }
                className={`category-button ${
                  selectedCategory === category ? "selected" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedCategory}
            className={`submit-button ${
              loading || !selectedCategory ? "disabled" : ""
            }`}
          >
            {loading ? "Uploading..." : "Save to Wardrobe"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadClothes;
