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

const usePageTitle = () => {
  const location = useLocation();
  useEffect(() => {
    switch (location.pathname) {
      case '/signup':
        document.title = 'Signup';
        break;
      case '/play':
        document.title = "Play";
        break;
      case '/play/computer':
      case '/play/online':
        document.title = "Game is in Session";
        break;
      case '/settings':
        document.title = "Settings";
        break;
      case '/help':
        document.title = "Help";
        break;
      default:
        document.title = "fitchck";
    }
  }, [location]);
}

function App() {
  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  usePageTitle();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/outfits" element={<OutfitsPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile" element={<UpdateProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;