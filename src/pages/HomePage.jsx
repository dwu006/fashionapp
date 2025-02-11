import UploadClothes from "../components/UploadClothes";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/App.css";

function HomePage() {

    return (
        <div className="page home">
            <Header />
            <UploadClothes />
            <Footer />
        </div>
    )
}

export default HomePage;