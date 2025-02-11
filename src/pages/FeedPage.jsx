import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import { Navigate } from "react-router-dom";

function FeedPage() {
    const isAuthenticated = localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="page feed">
            <UserHeader />
            <div className="content">
                <h1>My Feed</h1>
                {/* Feed content will go here */}
            </div>
            <Footer />
        </div>
    )
}

export default FeedPage;