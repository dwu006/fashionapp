import React, { useState, useEffect } from "react";
import axios from "axios";

//connect to backend server
const axios2 = axios.create({
  baseURL: 'http://localhost:5000'
});

const UploadClothes = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Fetch user profile to get user ID when component mounts
    const fetchUserId = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserId(data._id);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
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
      
      // Create form data with both image and category
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', selectedCategory);  

      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      console.log('Uploading with category:', selectedCategory);

      // Send data to backend
      const response = await axios2.post('/wardrobe/upload', formData, config);

      if (response.status === 200) {
        setImage(null);
        setFile(null);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to upload image: ' + (error.response?.data?.error || error.message));
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
        Upload Clothes
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
          <img 
            src={image} 
            alt="Clothes" 
            style={{ 
              width: "100%", 
              maxWidth: "200px", 
              marginBottom: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} 
          />

          {/* Category Selection Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '600px'
          }}>
            {['top', 'bottom', 'outerwear', 'accessories', 'other'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(prev => prev === category ? null : category)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: selectedCategory === category ? '#4CAF50' : '#f0f0f0',
                  color: selectedCategory === category ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s',
                  flex: '1',
                  minWidth: 'fit-content',
                  fontSize: '0.9rem'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading || !selectedCategory}
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