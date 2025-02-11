import { useNavigate } from "react-router-dom";
import "../styles/LoginSignUp.css";

function SignUpPage() {
    const navigate = useNavigate();
    function handleClick() {
        navigate("/");
    }
    return (
        <div className="page">
        <h1>fitchck</h1>
        <div className="box">
            <h1>Sign Up</h1>
            <input className="input-info" type="text" id="email"/>
            <input className="input-info" type="password" id="password"/>
            <button className="button" onClick={handleClick}>Sign Up</button>
            <p>Already have an account? <a href="./">Login</a></p>
        </div>
        <p>©2024 Fitchck All Rights Reserved</p>
        </div>
    )
}

export default SignUpPage;