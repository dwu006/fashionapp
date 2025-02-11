import "../styles/HeaderFooter.css";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token');

    function handleClick(id) {
        if (id === "home") {
            navigate("/");
        }
        if (id === "about") {
            navigate("/about");
        }
        if (id === "login") {
            navigate("/login");
        }
        if (id === "wardrobe") {
            if (isAuthenticated) {
                navigate("/wardrobe");
            } else {
                navigate("/login");
            }
        }
        if (id === "outfits") {
            if (isAuthenticated) {
                navigate("/outfits");
            } else {
                navigate("/login");
            }
        }
        if (id === "feed") {
            if (isAuthenticated) {
                navigate("/feed");
            } else {
                navigate("/login");
            }
        }
        if (id === "logout") {
            localStorage.removeItem('token');
            navigate("/");
        }
    }

    return (
        <>
            <div className="menu header">
                <h1 style={{ margin: '0px' }}><a href="./" style={{ color: "inherit"}}>fitchck</a></h1>
                <div style={{ margin: 'auto' }}>
                    <button className="button" id="home" onClick={() => handleClick("home")}>Home</button>
                    <button className="button" id="wardrobe" onClick={() => handleClick("wardrobe")}>Wardrobe</button>
                    <button className="button" id="outfits" onClick={() => handleClick("outfits")}>Outfits</button>
                    <button className="button" id="feed" onClick={() => handleClick("feed")}>Feed</button>
                    <button className="button" id="about" onClick={() => handleClick("about")}>About</button>
                </div>
                {isAuthenticated ? (
                    <button className="button login" onClick={() => handleClick("logout")}>Logout</button>
                ) : (
                    <button className="button login" onClick={() => handleClick("login")}>Login</button>
                )}
            </div>
        </>
    )
}

export default Header;