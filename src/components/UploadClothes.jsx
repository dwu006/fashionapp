import React, { useState, useEffect } from "react";
import axios from "axios";

//connect to backend server
const axios2 = axios.create({
  baseURL: 'http://localhost:5001'
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
        const response = await fetch('http://localhost:5001/users/profile', {
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
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', selectedCategory);  

      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      console.log('Uploading with category:', selectedCategory);

      const response = await axios2.post('/wardrobe/upload', formData, config);

      if (response.status === 200) {
        // Clear form
        setImage(null);
        setFile(null);
        setSelectedCategory(null);
        
        // Notify parent to refresh wardrobe
        onUploadSuccess();
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
    <div className="upload-clothes" style={{ 
      padding: '15px',
      backgroundColor: '#2c2c2c',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      color: 'white',
      height: image ? '400px' : 'auto',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
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
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'inline-block',
          marginBottom: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s',
          fontSize: '0.9rem'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
      >
        Upload Clothing
      </label>

      {image && (
        <div className="image-preview" style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <img 
            src={image} 
            alt="Clothes" 
            style={{ 
              width: "100%",
              height: "180px",
              objectFit: "contain",
              marginBottom: '15px',
              borderRadius: '8px',
              backgroundColor: '#1a1a1a'
            }} 
          />

          {/* Category Selection Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginBottom: '15px',
            width: '100%'
          }}>
            {['top', 'bottom', 'outerwear', 'shoes', 'accessories', 'other'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(prev => prev === category ? null : category)}
                style={{
                  padding: '8px',
                  backgroundColor: selectedCategory === category ? '#4CAF50' : '#3c3c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s',
                  fontSize: '0.8rem',
                  fontWeight: selectedCategory === category ? 'bold' : 'normal',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap'
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
              padding: '8px 20px',
              backgroundColor: loading || !selectedCategory ? '#404040' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !selectedCategory ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s',
              width: 'fit-content'
            }}
          >
            {loading ? 'Uploading...' : 'Save to Wardrobe'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadClothes;