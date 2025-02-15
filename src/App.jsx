import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import WardrobePage from "./pages/WardrobePage.jsx";
<<<<<<< HEAD
import OutfitPage from './pages/OutfitPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
=======
import OutfitsPage from "./pages/OutfitsPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
>>>>>>> 28db1a7

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<HomePage/>} />
        <Route path="/wardrobe" element={<WardrobePage/>} />
        <Route path="/outfits" element={<OutfitPage/>} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path="/about" element={<AboutPage/>} />
      </Routes>
    </BrowserRouter>

=======
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
>>>>>>> 28db1a7
  )
}

export default App