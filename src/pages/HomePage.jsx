import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/PageLayout.css";
import "../styles/HomePage.css";
import { Link, useNavigate } from "react-router-dom";
import profileImage from "../assets/profile.jpg";
import user1 from "../assets/user1.jpg";
import user2 from "../assets/user2.jpg";
import user3 from "../assets/user3.jpg";

function HomePage() {
    const isAuthenticated = localStorage.getItem('token');

    const navigate = useNavigate();
    function handleGetStarted() {
        navigate("/signup");
    }
    return (
        <div className="page home">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <div className="home-container">
                <div className="intro-section">
                    <div className="text-content">
                        <h1 className="main-heading">AI-Powered</h1>
                        <h2 className="sub-heading">Outfit Recommendations</h2>
                        <Link to="/wardrobe" className="get-started-btn">Get Started</Link>
                    </div>
                    <img src={profileImage} alt="Fashion Model" className="profile-image" />
                </div>
                <div className="testimonials-section">
                    <h3 className="testimonials-heading">What users have to say:</h3>
                    <div className="testimonials">
                        <div className="testimonial-card">
                            <img src={user1} alt="Rachel" />
                            <p>"Everyone keeps complimenting my style! Love my new looks!"</p>
                            <span>- Rachel</span>
                            <div className="stars">★★★★☆</div>
                        </div>
                        <div className="testimonial-card">
                            <img src={user2} alt="Sofia" />
                            <p>"Obsessed with how my outfits turn out—so easy and fun!"</p>
                            <span>- Sofia</span>
                            <div className="stars">★★★★★</div>
                        </div>
                        <div className="testimonial-card">
                            <img src={user3} alt="Loraine" />
                            <p>"This app is a total game-changer. My wardrobe is on point!"</p>
                            <span>- Loraine</span>
                            <div className="stars">★★★★★</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
