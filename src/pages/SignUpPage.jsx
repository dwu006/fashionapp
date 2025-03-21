import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/LoginSignUp.css";

function SignUpPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSignUp() {
        const userData = { name, email, password };
        try {
            const response = await fetch('http://localhost:5001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            console.log(data);
            navigate("/wardrobe");
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <div className="page">
            <div className="center">
                <div className="box">
                    <h1 className="title"style={{ color: "inherit" }}>fitchck</h1>
                    <p>Sign up to share your clothes, generate outfit recommendations, and help donating with your local community.</p>
                    {/* <h1>Sign Up</h1> */}
                    <input className="input-info" type="text" id="name" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} /> <br />
                    <input className="input-info" type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
                    <input className="input-info" type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br />
                    <button className="button login-btn" onClick={handleSignUp}>Sign Up</button>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
                <center><p>©2025 Fitchck All Rights Reserved</p></center>
            </div>
        </div>
    )
}

export default SignUpPage;