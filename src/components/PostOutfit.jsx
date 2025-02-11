import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PostOutfit.css';

const PostOutfit = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [visibility, setVisibility] = useState(false);
    const [caption, setCaption] = useState('');
    const [outfits, setOutfits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOutfit, setSelectedOutfit] = useState(null);
    const [comment, setComment] = useState('');

    // Fetch outfits when component mounts
    useEffect(() => {
        fetchOutfits();
    }, []);

    const fetchOutfits = async () => {
        try {
            const response = await axios.get('http://localhost:5000/outfits', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setOutfits(response.data);
        } catch (error) {
            console.error('Error fetching outfits:', error);
        }
    };

    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0];
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

            await axios.post('http://localhost:5000/outfits/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Reset form and close popup
            setImage(null);
            setFile(null);
            setVisibility(false);
            setCaption('');
            setShowPopup(false);
            
            // Refresh outfits
            fetchOutfits();
        } catch (error) {
            console.error('Error posting outfit:', error);
            alert('Failed to post outfit');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (outfitId) => {
        try {
            await axios.post(`http://localhost:5000/outfits/${outfitId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchOutfits(); // Refresh to update likes count
        } catch (error) {
            console.error('Error liking outfit:', error);
        }
    };

    const handleComment = async (outfitId) => {
        if (!comment.trim()) return;
        
        try {
            await axios.post(`http://localhost:5000/outfits/${outfitId}/comment`, 
                { text: comment },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setComment('');
            fetchOutfits(); // Refresh to show new comment
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const openDetailModal = (outfit) => {
        setSelectedOutfit(outfit);
        setShowDetailModal(true);
    };

    return (
        <div className="post-outfit-container">
            <button className="post-button" onClick={() => setShowPopup(true)}>
                Post Outfit
            </button>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
                        <div className="popup-form">
                            <div className="image-section">
                                <label htmlFor="image-upload">
                                    {!image ? 'Upload Image' : 'Change Image'}
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
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
                                    disabled={loading}
                                >
                                    {loading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="outfits-grid">
                {outfits.map((outfit) => (
                    <div key={outfit._id} className="outfit-card" onClick={() => openDetailModal(outfit)}>
                        <img
                            src={`data:${outfit.image.contentType};base64,${arrayBufferToBase64(outfit.image.data)}`}
                            alt="Outfit"
                            className="outfit-image"
                        />
                        <div className="outfit-details">
                            <div className="outfit-caption">{outfit.caption}</div>
                            <div className="outfit-actions">
                                <button className="action-button" onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(outfit._id);
                                }}>
                                    ❤️ {outfit.likes}
                                </button>
                                <button className="action-button">
                                    💬 {outfit.comments.length}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showDetailModal && selectedOutfit && (
                <div className="popup-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="outfit-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="detail-header">
                            <h2>Outfit Details</h2>
                            <button className="close-button" onClick={() => setShowDetailModal(false)}>×</button>
                        </div>
                        <img
                            src={`data:${selectedOutfit.image.contentType};base64,${arrayBufferToBase64(selectedOutfit.image.data)}`}
                            alt="Outfit"
                            className="detail-image"
                        />
                        <p>{selectedOutfit.caption}</p>
                        <div className="outfit-actions">
                            <button className="action-button" onClick={() => handleLike(selectedOutfit._id)}>
                                ❤️ {selectedOutfit.likes}
                            </button>
                        </div>
                        <div className="comments-section">
                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    className="comment-input"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleComment(selectedOutfit._id);
                                        }
                                    }}
                                />
                            </div>
                            <div className="comment-list">
                                {selectedOutfit.comments.map((comment, index) => (
                                    <div key={index} className="comment">
                                        <div className="comment-header">User</div>
                                        <div>{comment.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to convert array buffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export default PostOutfit;