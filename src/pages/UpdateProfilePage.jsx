import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import ProfilePicture from "../components/ProfilePicture.jsx";
import "../styles/LoginSignUp.css";
import "../styles/UpdateProfilePage.css";

function UpdateProfilePage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        // Fetch user profile when component mounts
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5001/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setUserId(data._id); // Store the user ID
                } else {
                    throw new Error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile');
            }
        };

        fetchProfile() ;
    }, []);

    async function handleUpdateProfile() {
        if (!userId) {
            setError('User ID not found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: password || undefined // Only send password if it's not empty
                })
            });

            if (response.ok) {
                setSuccess("Profile updated successfully!");
                // Update username in localStorage
                localStorage.setItem('username', name);
                // Clear password field
                setPassword("");
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile');
        }
    }

    const handleProfilePictureSuccess = () => {
        setSuccess("Profile picture updated successfully!");
    };

    return (
        <div className="page">
            <UserHeader />
            <div className="center">
                <div className="box profile-box">
                    <h1>My Profile</h1>
                    
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    
                    <div className="profile-picture-container">
                        <ProfilePicture key={localStorage.getItem('token')} size="large" editable={true} userId={userId} onUploadSuccess={handleProfilePictureSuccess} />
                        <p className="picture-hint">Click to change profile picture</p>
                    </div>
                    
                    <input 
                        className="input-info" 
                        type="text" 
                        placeholder="Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    /> <br />
                    
                    <input 
                        className="input-info" 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /> <br />
                    
                    <input 
                        className="input-info" 
                        type="password" 
                        placeholder="New Password (optional)" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /> <br />
                    
                    <button className="button" onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UpdateProfilePage;
