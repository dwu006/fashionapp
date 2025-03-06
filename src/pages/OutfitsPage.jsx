import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import GenerateOutfit from "../components/GenerateOutfit.jsx";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/PageLayout.css";

function OutfitsPage() {
    const [userId, setUserId] = useState('')
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();

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

    function handleClick() {
        navigate('/wardrobe');
    }

    return (
        <div className="page feed">
            <UserHeader />
            <div className="content">
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <h1>Generate Outfit</h1>
                    <div className="outfit-button-container">
                        <button className="button" style={{marginTop: '45px'}} onClick={() => handleClick()}>Saved Outfits</button>
                    </div>
                </div>
                <GenerateOutfit userId={userId} />
            </div>
            <Footer />
        </div>
    )
}

export default OutfitsPage;