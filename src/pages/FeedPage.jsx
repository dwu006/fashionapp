import { data, Navigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/PageLayout.css";
import "../styles/FeedPage.css";

// Set default base URL for API requests
axios.defaults.baseURL = 'http://localhost:5001';

// Default profile image (using data URI to avoid external dependencies)
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

function FeedPage() {
    const isAuthenticated = localStorage.getItem('token');
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/outfits', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Check if response.data exists and is an array
            const postsArray = Array.isArray(response.data) ? response.data : response.data.outfits || [];
            
            // Transform the posts to include proper image URLs and ensure likes is an array
            const transformedPosts = postsArray.map(post => ({
                ...post,
                imageUrl: `data:${post.image.contentType};base64,${post.image.data}`,
                likes: Array.isArray(post.likes) ? post.likes : [],
                user: {
                    ...post.user,
                    profileImage: post.user.profileImage || DEFAULT_PROFILE_IMAGE
                },
                comments: (post.comments || []).map(comment => ({
                    ...comment,
                    user: {
                        ...comment.user,
                        profileImage: comment.user.profileImage || DEFAULT_PROFILE_IMAGE
                    }
                }))
            }));
            
            setPosts(transformedPosts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };



    const handleLike = async (postId) => {
        try {
            const post = posts.find(p => p._id === postId);
            if (!post) return;

            // Store current state
            const currentUserLiked = post.userHasLiked;
            const currentLikesCount = post.likesCount || 0;

            // Optimistically update UI
            const updatedPosts = posts.map(p => {
                if (p._id === postId) {
                    return {
                        ...p,
                        userHasLiked: !currentUserLiked,
                        likesCount: currentUserLiked ? currentLikesCount - 1 : currentLikesCount + 1
                    };
                }
                return p;
            });
            setPosts(updatedPosts);

            // Make API call
            const response = await axios.post(`/outfits/${postId}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update with server response
            setPosts(prevPosts => prevPosts.map(p => {
                if (p._id === postId) {
                    return {
                        ...p,
                        userHasLiked: response.data.userHasLiked,
                        likesCount: response.data.likesCount,
                        likes: response.data.likes
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error('Error liking post:', error);
            // Revert optimistic update on error using the stored state
            setPosts(prevPosts => prevPosts.map(p => {
                if (p._id === postId) {
                    return {
                        ...p,
                        userHasLiked: p.userHasLiked,
                        likesCount: p.likesCount,
                        likes: p.likes
                    };
                }
                return p;
            }));
        }
    };

    const handleComment = async (postId) => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/outfits/${postId}/comment`, {
                content: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Get current user's info
            const currentUser = {
                _id: localStorage.getItem('userId'),
                username: localStorage.getItem('username'),
                profileImage: localStorage.getItem('profileImage') || DEFAULT_PROFILE_IMAGE
            };
            
            // Update the post in the local state with the new comment
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    const newCommentObj = {
                        ...response.data.comment,
                        user: currentUser
                    };
                    return {
                        ...post,
                        comments: [...post.comments, newCommentObj]
                    };
                }
                return post;
            }));
            
            // Clear the comment input
            setNewComment("");
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page feed">
            <UserHeader />
            <div className="feed-container">
                <div style={{display:'flex', width: '100%', justifyContent:'space-between'}}>
                    <h3>Community Feed</h3>
                    <button className="button">Upload Clothes</button>
                </div>
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
    )
}

export default FeedPage;