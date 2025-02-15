import UploadClothes from "../components/UploadClothes";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

function HomePage() {

    const navigate = useNavigate();
    function handleGetStarted() {
        navigate("/signup");
    }
    return (
        <div className="page home">
            <Header />
            <h1>AI-Powered</h1>
            <h2>Outfit Recommendations</h2>
            {/* <UploadClothes /> */}
            <button className="button" onClick={handleGetStarted}>Get Started</button>
            <Footer />
        </div>
    )
}

export default HomePage;