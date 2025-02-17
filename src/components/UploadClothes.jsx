import React, { useState, useEffect } from "react";
import axios from "axios";

const axios2 = axios.create({
  baseURL: 'http://localhost:3000'
});

const UploadClothes = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [category, setCategory] = useState(''); // New state for category

  const categories = [
    'tops',
    'bottoms',
    'outerwear',
    'shoes',
    'accessories',
    'other'
  ];

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/profile', {
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

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    
    setImage(null);
    setFile(null);
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please upload an image file');
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
      alert("Please select an image");
      return;
    }

    if (!category) {
      alert("Please select a category");
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
      formData.append('userId', userId);
      formData.append('category', category); // Add category to form data

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };

      const response = await axios2.post('/wardrobe/upload', formData, config);

      if (response.status === 200) {
        alert('Item uploaded successfully');
        setImage(null);
        setFile(null);
        setCategory('');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-clothes flex flex-col items-center p-6">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
        className="hidden"
        id="file-upload"
      />
      
      <label 
        htmlFor="file-upload" 
        className="px-6 py-3 bg-green-500 text-white rounded cursor-pointer mb-6 hover:bg-green-600 transition-colors shadow-md"
      >
        Select Image
      </label>

      {image && (
        <div className="flex flex-col items-center w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Preview</h3>
          
          <img 
            src={image} 
            alt="Clothes preview" 
            className="w-full max-w-xs rounded-lg shadow-md mb-6" 
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full max-w-xs mb-6 p-2 border rounded-md shadow-sm"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <button 
            onClick={handleSubmit}
            disabled={loading || !category}
            className="w-full max-w-xs px-6 py-3 bg-blue-500 text-white rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {loading ? "Uploading..." : "Upload to Wardrobe"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadClothes;