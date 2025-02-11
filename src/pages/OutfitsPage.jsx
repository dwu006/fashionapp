import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import { Navigate } from "react-router-dom";

function OutfitsPage() {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page outfits">
            <UserHeader />
            <div className="content">
                <h1>My Outfits</h1>
                {/* Outfit content will go here */}
            </div>
            <Footer />
        </div>
    )
}

export default OutfitsPage;