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

import allImg from "../assets/all.png";
import otherImg from "../assets/other.jpg";
import outerwearImg from "../assets/outerwear.jpg";
import shoesImg from "../assets/shoes.jpg";
import topsImg from "../assets/tops.jpg";
import bottomsImg from "../assets/bottoms.jpg";
import accessoriesImg from "../assets/accessories.jpg";

const categories = [
  { name: "All", img: allImg },
  { name: "Top", img: topsImg },
  { name: "Bottom", img: bottomsImg }, 
  { name: "Outerwear", img: outerwearImg },
  { name: "Shoes", img: shoesImg },
  { name: "Accessories", img: accessoriesImg },
  { name: "Other", img: otherImg },
];

function WardrobePage() {
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
        {/* Wardrobe Header */}
        <div className="wardrobe-header">
          <h1>My Wardrobe</h1>
          <WeatherBox />
          <UploadClothes onUploadSuccess={handleWardrobeUpdate} />
        </div>

        {/* Category Selection Grid */}
        <div className="category-grid">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`category-item ${selectedCategory === category.name.toLowerCase() ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.name.toLowerCase())}
            >
              <img src={category.img} alt={category.name} className="category-img" />
              <button className="category-button">{category.name}</button>
            </div>
          ))}
        </div>

        {/* Wardrobe Content */}
        <div className="wardrobe-items">
          <MyWardrobe refreshTrigger={shouldRefresh} selectedCategory={selectedCategory} />
        </div>

        {/* Donation Map */}
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
