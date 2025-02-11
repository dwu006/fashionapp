import { useNavigate } from "react-router-dom";
import "../styles/LoginSignUp.css";


function LoginPage() {
    const navigate = useNavigate();
    function handleClick() {
        navigate("/");
    }
    return (
        <div className="page">
        <h1>fitchck</h1>
        <div className="box">
            <h1>Login</h1>
            <input className="input-info" type="text" id="email"/>
            <input className="input-info" type="password" id="password"/>
            <button className="button login-btn" onClick={handleClick}>Login</button>
            <p>Don't have an account? <a href="./signup">Register</a></p>
        </div>
        <p>©2024 Fitchck All Rights Reserved</p>
        </div>
    )
}

export default LoginPage;