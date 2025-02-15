import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/AboutPage.css";

function AboutPage() {
    return (
        <div className="page about">
            <Header />
            <div className="split-div">
                <div className="content">
                    <h1>Our Story</h1>
                    <p>
                    FitChck was started as a joint passion for fashion, technology, and sustainability. 
                    As a group of fashion-conscious developers, we noticed an imbalance in the way people 
                    engage with their wardrobes - leading to overconsumption and wasted resources. It is 
                    essential for fashionistas to have a product that not only helps them organize their 
                    clothes, but it also inspires them to make sustainable choices. With recommendations 
                    for their clothes, users are encouraged to share and interact on the FitChck site. 
                    FitChck makes it easier to buy the best clothing for their lives. 
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
                    <h1>Our Mission</h1>
                    <p>
                    At FitChck, our mission is to simplify the way people think 
                    about fashion by making it sustainable and better supported 
                    by communities. We believe that style should be both 
                    expressive and ethical. So we helps users create wardrobes, 
                    discover outfit possibilities, and connect with like-minded 
                    fashion enthusiasts. We aim to cut the amount of fashion 
                    waste and encourage a more responsible fashion approach by 
                    promoting conscious shopping choices and supplying resources.
                    </p>
                </div>
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