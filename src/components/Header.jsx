import "../styles/HeaderFooter.css";
import { useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate();

    function handleClick(id) {
        if (id === "home") {
            navigate("/");
        }
        if (id === "wardrobe") {
            navigate("/wardrobe");
        }
        if (id === "outfits") {
            navigate("/outfits");
        }
        if (id === "feed") {
            navigate("/feed");
        }
        if (id === "about") {
            navigate("/about");
        }
        if (id === "login") {
            navigate("/login");
        }
    }

    return (
        <>
            <div className="menu header">
                <h1 style={{ margin: '0px' }}>fitchck</h1>
                <div style={{ margin: 'auto' }}>
                    <button className="button" id="home" onClick={() => handleClick("home")}>Home</button>
                    <button className="button" id="wardrobe" onClick={() => handleClick("wardrobe")}>Wardrobe</button>
                    <button className="button" id="outfits" onClick={() => handleClick("outfits")}>Outfits</button>
                    <button className="button" id="feed" onClick={() => handleClick("feed")}>Feed</button>
                    <button className="button" id="about" onClick={() => handleClick("about")}>About</button>
                </div>
                <button className="button login" onClick={() => handleClick("login")}>Login</button>
            </div>
        </>
    )
}

export default Header;