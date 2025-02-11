import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import axios from 'axios';
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import PostOutfit from "../components/PostOutfit.jsx";
import "../styles/PostOutfit.css";

function OutfitsPage() {
    const [outfits, setOutfits] = useState([]);
    const isAuthenticated = localStorage.getItem('token');

    useEffect(() => {
        fetchUserOutfits();
    }, []);

    const fetchUserOutfits = async () => {
        try {
            const userId = localStorage.getItem('userId');
            console.log('Fetching outfits for user:', userId);
            
            const response = await axios.get(`http://localhost:5000/outfits?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Fetched outfits:', response.data);
            setOutfits(response.data);
        } catch (error) {
            console.error('Error fetching outfits:', error);
        }
    };

    const handleOutfitPosted = () => {
        console.log('New outfit posted, refreshing...');
        fetchUserOutfits();
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page outfits">
            <UserHeader />
            <div className="content">
                <h1>My Outfits</h1>
                <PostOutfit onOutfitPosted={handleOutfitPosted} />
                <div className="outfits-grid">
                    {outfits && outfits.length > 0 ? (
                        outfits.map((outfit) => (
                            <div key={outfit._id} className="outfit-card">
                                <img
                                    src={`data:${outfit.image.contentType};base64,${arrayBufferToBase64(outfit.image.data.data)}`}
                                    alt="Outfit"
                                    className="outfit-image"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No outfits found. Post your first outfit!</p>
                    )}
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

export default OutfitsPage;