import "../styles/HeaderFooter.css";
import "../styles/UserHeader.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ProfilePicture from "./ProfilePicture.jsx";

function UserHeader() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || 'Profile');
    const dropdownRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        // Fetch user profile when component mounts
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5001/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.ok && isMounted) {
                    const data = await response.json();
                    // Set username, truncate if longer than 8 characters
                    const displayName = data.name.length > 8 ? data.name.substring(0, 8) + '...' : data.name;
                    setUsername(displayName);
                    localStorage.setItem('username', displayName);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        // Only fetch if we don't have the username in localStorage
        if (!localStorage.getItem('username')) {
            fetchProfile();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleClick(id) {
        if (id === "home") {
            navigate("/");
        }
        if (id === "about") {
            navigate("/about");
        }
        if (id === "wardrobe") {
            navigate("/wardrobe");
        }
        if (id === "update-profile") {
            navigate("/update-profile");
            setIsDropdownOpen(false);
        }
        if (id === "logout") {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('profileImageUrl');
            localStorage.removeItem('profileImageData'); // Clear profile image data on logout
            navigate("/");
            setIsDropdownOpen(false);
        }
        if (id === "feed") {
            navigate("/feed");
        }
        if (id === "outfits") {
            navigate("/outfits");
        }
    }

    return (
        <header>
            <nav className="menu header user-header">
                <h1 style={{ marginLeft: '20px' }}><Link to="/" style={{ color: "inherit"}}>fitchck</Link></h1>
                <div className="menu-buttons">
                    <button className="button" id="home" onClick={() => handleClick("home")}>Home</button>
                    <button className="button" id="wardrobe" onClick={() => handleClick("wardrobe")}>Wardrobe</button>
                    <button className="button" id="outfits" onClick={() => handleClick("outfits")}>Outfits</button>
                    <button className="button" id="feed" onClick={() => handleClick("feed")}>Feed</button>
                    <button className="button" id="about" onClick={() => handleClick("about")}>About</button>
                </div>
                <div className="dropdown-container" ref={dropdownRef}>
                    <button 
                        className={`button login profile-button ${isDropdownOpen ? 'open' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="profile-button-content">
                            <ProfilePicture size="small" />
                            <span className="username">{username}</span>
                            <span className="arrow">▼</span>
                        </div>
                    </button>
                    {isDropdownOpen && (
                        <div className="profile-dropdown">
                            <button 
                                className="dropdown-button"
                                onClick={() => handleClick("update-profile")}
                            >
                                Update Profile
                            </button>
                            <button 
                                className="dropdown-button"
                                onClick={() => handleClick("logout")}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default UserHeader;