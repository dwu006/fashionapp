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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-clothes">
      {/* Upload button */}
      <label>
        Upload an Image
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      {image && (
        <div className="image-preview" style={{ 
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '300px'
        }}>
          <h3>Preview</h3>
          <img src={image} alt="Clothes" style={{ width: "100%", maxWidth: "100px" }} />
        </div>
      )}
    </div>
  );
};

export default UploadClothes;