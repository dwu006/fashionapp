import UploadClothes from "../components/UploadClothes";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function WardrobePage() {
    return (
        <div className="page wardrobe">
            <Header />
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <h1>My Wardrobe</h1>
                <UploadClothes />
            </div>
            <Footer />
        </div>
    )
}

export default WardrobePage;