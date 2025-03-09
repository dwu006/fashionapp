import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfilePicture.css';

// default pfp
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Connect to backend server
const axios2 = axios.create({
  baseURL: "http://localhost:5001",
});

function ProfilePicture({ size = 'medium', editable = false, onUploadSuccess = null }) {
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImageData') || DEFAULT_PROFILE_IMAGE);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [timestamp, setTimestamp] = useState(Date.now());

  // sizes
  const sizeClass = size === 'small' ? 'profile-small' : 
                   size === 'large' ? 'profile-large' : 'profile-medium';

  // Loading
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token: ", token);
    if (token) {
      axios2.get(`/users/profile-picture?t=${timestamp}`, {
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
        console.log('using default pfp', error);
      });
    }
  }, [timestamp]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    
    try {
      await axios2.post(`/users/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // convert file
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = function() {
        const base64data = reader.result;
        setProfileImage(base64data);
        localStorage.setItem('profileImageData', base64data);
      };
      
      setTimestamp(Date.now());
      setShowModal(false);
      setSelectedFile(null);
      
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error('upload error:', error);
      alert('Failed to upload image');
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
              disabled={!selectedFile}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;