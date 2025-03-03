import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import GenerateOutfit from "../components/GenerateOutfit.jsx";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../styles/PageLayout.css";

function OutfitsPage() {
    const [userId, setUserId] = useState('')
    const isAuthenticated = localStorage.getItem('token');

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
        <div className="page feed">
            <UserHeader />
            <div className="content">
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <h3>Generate Outfit</h3>
                    <button className="button">Saved Outfits</button>
                </div>
                <GenerateOutfit userId={userId}/>
            </div>
            <Footer />
        </div>
    )
}

export default OutfitsPage;