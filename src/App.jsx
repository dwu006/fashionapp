import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import WardrobePage from "./pages/WardrobePage.jsx";
import OutfitPage from './pages/OutfitPage.jsx';
import FeedPage from './pages/FeedPage.jsx';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/wardrobe" element={<WardrobePage/>} />
        <Route path="/outfits" element={<OutfitPage/>} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path="/about" element={<AboutPage/>} />
      </Routes>
    </BrowserRouter>

        <UploadClothes />

  )
}

export default App