import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import UploadClothes from "../components/UploadClothes.jsx";
import MyWardrobe from "../components/MyWardrobe.jsx";
import WeatherBox from "../components/WeatherBox.jsx";
import DonationMap from "../components/DonationMap.jsx";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import "../styles/WardrobePage.css";

function WardrobePage() {
    const isAuthenticated = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="page wardrobe">
            <UserHeader />
            <div className="content">
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <h1 style={{
                        textAlign: 'center',
                        marginBottom: '30px'
                    }}>
                        My Wardrobe
                    </h1>
                    <WeatherBox />
                    <UploadClothes />
                </div>
                <div style={{ marginTop: '40px' }}>
                    <MyWardrobe />
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
