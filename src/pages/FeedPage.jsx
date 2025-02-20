import { data, Navigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/PageLayout.css";
import "../styles/FeedPage.css";
import axios from "axios";

// Set default base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000';

// Default profile image (using data URI to avoid external dependencies)
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

function FeedPage() {
    const [outfits, setOutfits] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page feed">
            <UserHeader />
            <div className="feed-container">
                {loading ? (
                    <div>Loading...</div>
                ) : posts.length === 0 ? (
                    <div>No posts to show</div>
                ) : (
                    posts.map(post => (
                        <div key={post._id} className="feed-card">
                            <div className="feed-card-header">
                                <img 
                                    src={post.user.profileImage} 
                                    alt={post.user.username} 
                                    className="user-avatar"
                                />
                                <span className="username">{post.user.username}</span>
                            </div>
                            <img 
                                src={post.imageUrl} 
                                alt="Outfit" 
                                className="feed-image"
                            />
                            <div className="feed-card-actions">
                                <div className="action-buttons">
                                    <button 
                                        className={`action-button ${post.userHasLiked ? 'liked' : ''}`}
                                        onClick={() => handleLike(post._id)}
                                        title={post.userHasLiked ? "Unlike" : "Like"}
                                    >
                                        {post.userHasLiked ? '❤️' : '🤍'}
                                        <span>{post.likesCount || 0} likes</span>
                                    </button>
                                    <button 
                                        className="action-button"
                                        onClick={() => setSelectedPost(post)}
                                        title="Comments"
                                    >
                                        💬
                                        <span>{post.comments ? post.comments.length : 0} comments</span>
                                    </button>
                                </div>
                                <div className="caption">
                                    <strong>{post.user.username}</strong> {post.caption}
                                </div>
                                {post.comments && post.comments.length > 0 && (
                                    <div 
                                        className="view-comments"
                                        onClick={() => setSelectedPost(post)}
                                    >
                                        View all {post.comments.length} comments
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedPost && (
                <div className="comments-modal" onClick={() => setSelectedPost(null)}>
                    <button className="close-modal" title="Close">✕</button>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-image">
                            <img src={selectedPost.imageUrl} alt="Outfit" />
                        </div>
                        <div className="comments-section">
                            <div className="comments-header">
                                <img 
                                    src={selectedPost.user.profileImage} 
                                    alt={selectedPost.user.username} 
                                    className="user-avatar"
                                />
                                <span className="username">{selectedPost.user.username}</span>
                            </div>
                            <div className="comments-list">
                                {selectedPost.comments && selectedPost.comments.map((comment, index) => (
                                    <div key={index} className="comment">
                                        <img 
                                            src={comment.user.profileImage} 
                                            alt={comment.user.username} 
                                            className="user-avatar"
                                        />
                                        <div className="comment-content">
                                            <span className="comment-username">{comment.user.username}</span>
                                            {comment.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="add-comment">
                                <textarea
                                    className="comment-input"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleComment(selectedPost._id);
                                        }
                                    }}
                                />
                                <button 
                                    className="send-comment-btn"
                                    onClick={() => handleComment(selectedPost._id)}
                                    disabled={!newComment.trim()}
                                    title="Send comment"
                                >
                                    ➤
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

// Helper function to convert array buffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export default FeedPage;