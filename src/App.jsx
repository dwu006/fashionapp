import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import WardrobePage from "./pages/WardrobePage.jsx";
import OutfitsPage from "./pages/OutfitsPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected Routes */}
        <Route path="/wardrobe" element={
          <ProtectedRoute>
            <WardrobePage />
          </ProtectedRoute>
        } />
        <Route path="/outfits" element={
          <ProtectedRoute>
            <OutfitsPage />
          </ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        } />
        <Route path="/update-profile" element={
          <ProtectedRoute>
            <UpdateProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
