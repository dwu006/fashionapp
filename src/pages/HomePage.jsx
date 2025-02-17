import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/App.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const isAuthenticated = localStorage.getItem('token');

    const navigate = useNavigate();
    function handleGetStarted() {
        navigate("/signup");
    }
    return (
        <div className="page home">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <div className="content">
                <h1>AI-Powered</h1>
                <h2>Outfit Recommendations</h2>
                <button className="button" onClick={handleGetStarted}>Get Started</button>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;