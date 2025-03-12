import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import GenerateOutfit from "../components/GenerateOutfit.jsx";
import MyWardrobe from "../components/MyWardrobe.jsx";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../styles/PageLayout.css";
import "../styles/ChatBot.css";

function OutfitsPage() {
    const [userId, setUserId] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const isAuthenticated = localStorage.getItem('token');
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const handleWardrobeUpdate = () => {
        setShouldRefresh((prev) => !prev);
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
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
    }, [userId]);

    return (
        <div className="page outfit">
            <UserHeader />
            <div className="content" style={{ marginTop: '60px' }}>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '20px'
                }}>
                    <h1 style={{
                        margin: '0px'
                    }}>
                        AI Outfit Generator
                    </h1>
                    <div className="saved-outfit-container">
                        <button className="saved-button"
                            onClick={() => setShowPopup(!showPopup)}
                        >
                            Saved Outfits
                        </button>
                    </div>
                </div>
                <GenerateOutfit userId={userId} />
            </div>
            {showPopup && (
                <div className="saved-outfits-popup" onClick={() => setShowPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Saved Outfits</h2>
                        <button className="close-button" onClick={() => setShowPopup(false)}>X</button>
                        <div className="wardrobe-items">
                            <MyWardrobe refreshTrigger={shouldRefresh} selectedCategory={selectedCategory} />
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default OutfitsPage;