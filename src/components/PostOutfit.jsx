import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PostOutfit.css';

const PostOutfit = ({ onOutfitPosted }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [visibility, setVisibility] = useState(false);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            console.log('Selected file:', selectedFile);
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Please select an image');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('visibility', visibility);
            formData.append('caption', caption);

            console.log('Submitting outfit with:', {
                fileSize: file.size,
                fileType: file.type,
                visibility,
                caption
            });

            const response = await axios.post('http://localhost:5001/outfits/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            console.log('Upload response:', response.data);

            // Reset form and close popup
            setImage(null);
            setFile(null);
            setVisibility(false);
            setCaption('');
            setShowPopup(false);
            
            // Notify parent component to refresh outfits
            if (onOutfitPosted) {
                onOutfitPosted();
            }
        } catch (error) {
            console.error('Error posting outfit:', error);
            alert('Failed to post outfit: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-outfit-container">
            <button className="post-button" onClick={() => setShowPopup(true)}>
                Post Outfit
            </button>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
                        <div className="popup-form">
                            <div className="image-section">
                                <label htmlFor="image-upload" className="upload-label">
                                    {!image ? 'Upload Image' : 'Change Image'}
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="file-input"
                                />
                                {image && <img src={image} alt="Preview" className="image-preview" />}
                            </div>
                            <div className="details-section">
                                <div className="visibility-toggle">
                                    <span>Public</span>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={visibility}
                                            onChange={(e) => setVisibility(e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                                <textarea
                                    className="caption-input"
                                    placeholder="Write a caption..."
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                                <button
                                    className="submit-button"
                                    onClick={handleSubmit}
                                    disabled={loading || !file}
                                >
                                    {loading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostOutfit;