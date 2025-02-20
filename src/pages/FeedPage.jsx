import React, { useState, useEffect } from 'react';
import { data, Navigate } from "react-router-dom";
import axios from 'axios';
import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import PostOutfit from "../components/PostOutfit.jsx";
import "../styles/PageLayout.css";

function FeedPage() {
    const [outfits, setOutfits] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const isAuthenticated = localStorage.getItem('token');

    function handleClick(outfit) {
        setSelectedItem(outfit);
    }

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


    useEffect(() => {
        if (!userId) return;
        const fetchUserOutfits = async () => {
            try {
                console.log('Fetching outfits for user:', userId);
                
                const responseUser = await axios.get(`http://localhost:5001/users`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const temp = responseUser.data;
                const userIds = temp.map(user => user._id);
                const allOutfits = [];

                for (let i = 0; i < userIds.length; i++) {
                    const response = await axios.get(`http://localhost:5001/outfits?userId=${userIds[i]}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    if (response.data.length > 0) {
                        allOutfits.push(response.data);
                    }
                }

                setOutfits(allOutfits.flat());
                console.log("Fetched outfits", allOutfits);

            } catch (error) {
                console.error('Error fetching outfits:', error);
            }
        };
        fetchUserOutfits();
    }, [userId]);

    const handleOutfitPosted = () => {
        console.log('New outfit posted, refreshing...');
        fetchUserOutfits();
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page outfits">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <div className="content">
                <div style={{ display: 'flex', justifyContent: 'space-around', color:'white' }}>
                    <h1>Community Outfits</h1>
                    <PostOutfit onOutfitPosted={handleOutfitPosted} />
                </div>
                <div className="outfits-grid">
                    {outfits && outfits.length > 0 ? (
                        outfits.map((outfit) => (
                            <div key={outfit._id} className="outfit-card">
                                <img
                                    src={`data:${outfit.image.contentType};base64,${arrayBufferToBase64(outfit.image.data.data)}`}
                                    alt="Outfit"
                                    className="outfit-image"
                                    onClick={() => handleClick(outfit)}
                                />
                                <p>{outfit.caption}</p>
                            </div>
                        ))
                    ) : (
                        <p>No outfits found. Post your first outfit!</p>
                    )}
                    {selectedItem &&
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }} onClick={() => setSelectedItem(null)}>
                            <div style={{
                                backgroundColor: '#1a1a1a',
                                padding: '30px',
                                borderRadius: '15px',
                                maxWidth: '90%',
                                maxHeight: '90%',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                            }} onClick={e => e.stopPropagation()}>
                                <div style={{
                                    width: '100%',
                                    height: '70vh',
                                    display: 'block',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                    overflowX: 'hidden',
                                    overflowY: 'auto',
                                    color: 'white'
                                }}>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            border: 'none',
                                            background: 'none',
                                            color: 'white',
                                            fontSize: '28px',
                                            cursor: 'pointer',
                                            padding: '5px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        ×
                                    </button>
                                    <img
                                        src={`data:${selectedItem.image};base64,${arrayBufferToBase64(selectedItem.image.data.data)}`}
                                        alt="Selected item"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <p>{selectedItem.caption}</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
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