import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import UploadClothes from "../components/UploadClothes.jsx";
import MyWardrobe from "../components/MyWardrobe.jsx";
import WeatherBox from "../components/WeatherBox.jsx";
import DonationMap from "../components/DonationMap.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/WardrobePage.css";

function WardrobePage() {
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleWardrobeUpdate = () => {
    setShouldRefresh((prev) => !prev);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page wardrobe">
      <UserHeader />
      <div className="content">
        {/* New Wardrobe Header for Proper Alignment */}
        <div className="wardrobe-header">
          <h1>My Wardrobe</h1>
          <WeatherBox />
          <UploadClothes onUploadSuccess={handleWardrobeUpdate} />
        </div>

        {/* Wardrobe Content */}
        <div className="wardrobe-items">
          <MyWardrobe refreshTrigger={shouldRefresh} />
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
