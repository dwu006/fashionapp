import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import UploadClothes from "../components/UploadClothes.jsx";
import MyWardrobe from "../components/MyWardrobe.jsx";
import WeatherBox from "../components/WeatherBox.jsx";
import DonationMap from "../components/DonationMap.jsx";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../styles/WardrobePage.css";

function WardrobePage() {
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();
    const [shouldRefresh, setShouldRefresh] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleWardrobeUpdate = () => {
        setShouldRefresh(prev => !prev);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="page wardrobe">
            <UserHeader />
            <div className="content">
                <div style={{ 
                    display: 'flex', 
                    width: '100%', 
                    gap: '20px',
                    position: 'relative',
                    marginBottom: '40px'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '30px'
                        }}>
                            <h1 style={{ marginRight: 'auto' }}>My Wardrobe</h1>
                            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                                <WeatherBox />
                            </div>
                        </div>
                        <MyWardrobe refreshTrigger={shouldRefresh} />
                    </div>
                    <div style={{ 
                        position: 'sticky',
                        height: 'fit-content',
                        alignSelf: 'flex-start'
                    }}>
                        <UploadClothes onUploadSuccess={handleWardrobeUpdate} />
                    </div>
                </div>
                {/* Donation Map Section */}
                <div className="donation-map-container">
                    <h2>Find Nearby Donation Centers</h2>
                    <DonationMap />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default WardrobePage;
