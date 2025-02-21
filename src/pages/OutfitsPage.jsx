import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import { Navigate } from "react-router-dom";
import "../styles/PageLayout.css";

function OutfitsPage() {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page feed">
            <UserHeader />
            <div className="content">
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <h3>Generate Outfit</h3>
                    <button className="button">Saved Outfits</button>
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                    <button className="button">Work</button>
                    <button className="button">Casual</button>
                    <button className="button">Gym</button>
                    <button className="button">Date Night</button>
                </div>
                {/* Feed content will go here */}
            </div>
            <Footer />
        </div>
    )
}

export default OutfitsPage;