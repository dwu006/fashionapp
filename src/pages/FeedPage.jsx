import Header from "../components/Header.jsx";
<<<<<<< HEAD
import Footer from "../components/Footer.jsx";

function FeedPage() {
    return (
        <div className="page feed">
            <Header />
=======
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import { Navigate } from "react-router-dom";
import "../styles/PageLayout.css";

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
>>>>>>> 28db1a7
            <Footer />
        </div>
    )
}

export default FeedPage;