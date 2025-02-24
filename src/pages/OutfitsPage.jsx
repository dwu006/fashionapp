import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import GenerateOutfit from "../components/GenerateOutfit.jsx";
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
                <GenerateOutfit />
            </div>
            <Footer />
        </div>
    )
}

export default OutfitsPage;