import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import UploadClothes from "../components/UploadClothes.jsx";

function OutfitPage() {
    return (
        <div className="page outfit">
            <Header />
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <h1>Community Outfit</h1>
                <UploadClothes />
            </div>
            <Footer />
        </div>
    )
}

export default OutfitPage;