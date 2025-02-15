import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/PageLayout.css";

function HomePage() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <div className="page home">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <div className="content">
                {/* Your existing home page content */}
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;