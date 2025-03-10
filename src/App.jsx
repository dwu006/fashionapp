import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WardrobePage from "./pages/WardrobePage";
import OutfitsPage from "./pages/OutfitsPage";
import FeedPage from "./pages/FeedPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import "./styles/App.css";
import "./styles/Theme.css"; // Import the theme styles

const PageTitleUpdater = () => {
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case "/signup":
        document.title = "Signup";
        break;
      case "/login":
        document.title = "Login";
        break;
      case "/about":
        document.title = "About";
        break;
      case "/update-profile":
        document.title = "Update Profile";
        break;
      case "/wardrobe":
        document.title = "Wardrobe";
        break;
      case "/outfits":
        document.title = "Outfit Generator";
        break;
      case "/feed":
        document.title = "Community Feed";
        break;
      default:
        document.title = "fitchck";
    }
  }, [location]);

  return null; 
};

function App() {
  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <Router>
      <PageTitleUpdater />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/outfits" element={<OutfitsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/profile" element={<UpdateProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
