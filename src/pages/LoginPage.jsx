import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/LoginSignUp.css";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const response = await fetch('http://localhost:5001/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                // Navigate to wardrobe page on successful login
                navigate("/wardrobe");
            } else {
                // Handle login error
                alert(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred during login. Please try again.');
        }
    }

    return (
        <div className="page">
            <div className="center">
                <div className="box">
                    <h1 className="title" style={{ color: "inherit" }}>fitchck</h1>
                    <p>Login to view your clothes and your impact with your local community.</p>
                    <input className="input-info" type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                    <input className="input-info" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                    <button className="button login-btn" onClick={handleLogin}>Login</button>
                    <p>Don't have an account? <Link to="/signup">Register</Link></p>
                </div>
                <center><p>©2025 Fitchck All Rights Reserved</p></center>
            </div>
        </div>
    )
}

export default LoginPage;