import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/PageLayout.css";

function AboutPage() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <div className="page about">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <div className="content">
                <h1>Our Story</h1>
                <p>
                    Test
                </p>
                <h1>Our Image</h1>
                <p>
                    Test
                </p>
                <h1>Our Image</h1>
                <p>
                    Test
                </p>
                <h1>Our Image</h1>
                <p>
                    Test
                </p>
            </div>
            <Footer />
        </div>
    )
}

export default AboutPage;