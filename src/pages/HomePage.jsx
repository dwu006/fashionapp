import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/App.css";

function HomePage() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <div className="page home">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <Footer />
        </div>
    )
}

export default HomePage;