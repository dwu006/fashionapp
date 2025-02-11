import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import UploadClothes from "../components/UploadClothes.jsx";
import "../styles/WardrobePage.css";

function WardrobePage() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <div className="page wardrobe">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <UploadClothes />
            <Footer />
        </div>
    )
}

export default WardrobePage;