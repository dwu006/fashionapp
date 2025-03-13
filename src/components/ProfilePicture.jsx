import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfilePicture.css';

// default pfp
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Connect to backend server
const axios2 = axios.create({
  baseURL: "http://localhost:5001",
});

function ProfilePicture({ size = 'medium', editable = false, onUploadSuccess = null, userId }) {
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImageData') || DEFAULT_PROFILE_IMAGE);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [isUploading, setIsUploading] = useState(false);

  // sizes
  const sizeClass = size === 'small' ? 'profile-small' : 
                   size === 'large' ? 'profile-large' : 'profile-medium';

  // Loading
  useEffect(() => {
    const token = localStorage.getItem('token');  
    if (token && userId) {
      axios2.get(`/users/profile-picture/${userId}?t=${timestamp}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      .then(response => {
        // use base64 string
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = function() {
          const base64data = reader.result;
          setProfileImage(base64data);
          // store in localStorage for persistence
          localStorage.setItem('profileImageData', base64data);
        };
      })
      .catch((error) => {
        console.log('Using default profile picture', error);
      });
    }
  }, [timestamp, userId]);

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      alert('You need to be logged in to upload a profile picture');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    
    // Debug logging
    console.log('File details:', {
      name: selectedFile.name,
      type: selectedFile.type,
      size: `${Math.round(selectedFile.size / 1024)} KB`
    });
    
    try {
      // The server extracts userId from the JWT token, so we don't need to include it in the URL
      console.log('Uploading profile picture to:', `${axios2.defaults.baseURL}/users/profile-picture`);
      console.log('Using auth token:', token ? 'Token available' : 'No token');
      
      // Try with timeout and more detailed error handling
      const response = await axios2.post('/users/profile-picture', formData, {
        headers: {
          // Don't manually set Content-Type for FormData, let the browser set it with the boundary
          Authorization: `Bearer ${token}`
        },
        timeout: 30000, // 30 second timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      console.log('Upload response:', response);
      
      // convert file to base64 for local display
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = function() {
        const base64data = reader.result;
        setProfileImage(base64data);
        localStorage.setItem('profileImageData', base64data);
        
        // Refresh the component
        setTimestamp(Date.now());
        setShowModal(false);
        setSelectedFile(null);
        
        if (onUploadSuccess) onUploadSuccess();
      };
    } catch (error) {
      console.error('Upload error:', error);
      
      // More detailed error message
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Failed to upload image: ${error.response.data.message || error.response.data.error || error.response.statusText}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Failed to upload image: No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Failed to upload image: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Profile Picture */}
      <div className={`profile ${sizeClass}`} onClick={() => editable && setShowModal(true)}>
        <img src={profileImage} alt="Profile" />
        {editable && <div className="edit-icon">✎</div>}
      </div>

      {/* upload modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => {
          // Close modal when clicking on the overlay (outside the modal)
          if (e.target.className === 'modal-overlay') {
            setShowModal(false);
          }
        }}>
          <div className="modal">
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            <h3>Update Profile Picture</h3>
            
            <div className="preview">
              <img src={selectedFile ? URL.createObjectURL(selectedFile) : profileImage} alt="Preview" />
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setSelectedFile(e.target.files[0])} 
            />
            
            <button 
              className="upload-btn"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;