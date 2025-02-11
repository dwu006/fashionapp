import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/AboutPage.css";

function AboutPage() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <div className="page about">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <div className="split-div">
                <div className="content">
                    <h1>Our Story</h1>
                    <p>
                        We're the best in the business. Skibbi toilet edging out in 
                        Ohio. Eggert edging out for the win. Take the winner winner 
                        chicken dinner, victory royale out of our Fortnite game, 
                        cause this game is extremely lit.
                    </p>
                </div>
                <div className="content">
                    <h1>Our Image</h1>
                    <p>
                        Skibbidi image gone broom
                    </p>
                </div>
            </div>
            <div className="split-div">
                <div className="content">
                    <h1>Our Image</h1>
                    <p>
                        Skibbidi image gone broom
                    </p>
                </div>
                <div className="content">
                    <h1>Our Image</h1>
                    <p>
                        Skibbidi image gone broom
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AboutPage;