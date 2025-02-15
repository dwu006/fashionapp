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
    
    // Clear previous image and file
    setImage(null);
    setFile(null);
    
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        alert('Upload an image');
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        alert('Error reading file');
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
        setImage(null);
        setFile(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-clothes" style={{ textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Hidden file input */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="file-upload"
      />
      
      {/* Styled label as button */}
      <label 
        htmlFor="file-upload" 
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'inline-block',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Upload Clothing
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
        <div className="image-preview" style={{ 
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '300px'
        }}>
          <h3>Preview</h3>
          <img 
            src={image} 
            alt="Clothes" 
            style={{ 
              width: "100%", 
              maxWidth: "200px", 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }} 
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{ 
              marginTop: "20px",
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.3s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              width: '200px'
            }}
          >
            {loading ? "Uploading..." : "Upload to Wardrobe"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadClothes;