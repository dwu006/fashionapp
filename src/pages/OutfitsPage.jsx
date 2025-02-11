import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import PostOutfit from "../components/PostOutfit.jsx";
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
                <PostOutfit />
            </div>
            <Footer />
        </div>
    )
}

export default OutfitsPage;