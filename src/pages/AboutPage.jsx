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
            <div className="wide-box">
                <h1>Our Team</h1>
                <div style={{display:'flex', placeContent:'center', padding: 'auto'}}>
                    <h2>Daniel Wu</h2>
                    <h2>Victor Acuna</h2>
                    <h2>Colin Murphy</h2>
                    <h2>Kevin Trinh</h2>
                    <h2>Chianie Chu</h2>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AboutPage;