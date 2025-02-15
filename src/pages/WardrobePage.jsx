import UploadClothes from "../components/UploadClothes";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import axios from "axios";
import {useState, useEffect} from "react";
import { use } from "react";

//connect to backend server
const axios2 = axios.create({
  baseURL: 'http://localhost:5001'
});

function WardrobePage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageURLs, setImageURLs] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios2.get("/wardrobe");
                console.log(response.data);
                setData(response.data);
                setLoading(true);
            }
            catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (!data) return;
        function loadImage(image) {
            if (!image || !image.data || !image.data.data) return "";
            console.log(image.data.data);
            const imageBuffer = new Uint8Array(image.data.data);
            const blob = new Blob([imageBuffer], { type: "image/png" });
            return URL.createObjectURL(blob);
        }
        const urls = data.map(item => loadImage(item.image))
        .filter(Boolean);
        setImageURLs(urls);
        console.log("First Image Data:", data[0].image.data.data.slice(0, 10)); // Logs first 10 elements
        console.log("Generated URLs:", imageURLs);
        
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [data]);

    return (
        <div className="page wardrobe">
            <Header />
            <div style={{display:'flex', justifyContent:'space-around'}}>
                <h1>My Wardrobe</h1>
                <UploadClothes />
            </div>
            <div className="box-images">
                {imageURLs.map((url, index) => {
                    <img key={index} src={url} alt={`Image ${index}`}/>
                })}
            </div>
            <Footer />
        </div>
    )
}

export default WardrobePage;