import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "../styles/PageLayout.css";
import "../styles/AboutPage.css";
import ourStoryImage from "../assets/our-story.jpg";
import ourMissionImage from "../assets/our-mission.jpg";
import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";
import team5 from "../assets/team5.jpg";

// Team members data
const teamMembers = [
    {
        name: "Daniel Wu",
        image: team1,
        university: "University of California, Los Angeles",
        year: "1st Year",
        major: "Computer Science and Engineering",
    },
    {
        name: "Victor Acuna",
        image: team2,
        university: "University of California, Los Angeles",
        year: "3rd Year",
        major: "Computer Science and Engineering",
    },
    {
        name: "Colin Murphy",
        image: team3,
        university: "University of California, Los Angeles",
        year: "2nd Year",
        major: "Linguistics and Computer Science, Economics",
    },
    {
        name: "Kevin Trinh",
        image: team4,
        university: "University of California, Los Angeles",
        year: "2nd Year",
        major: "Linguistics and Computer Science",
    },
    {
        name: "Chianie Chi",
        image: team5,
        university: "University of California, Los Angeles",
        year: "2nd Year",
        major: "Linguistics and Computer Science",
    },
];

function AboutPage() {
    return (
        <div className="page about">
            <Header />
            <div className="about-container">
                {/* Our Story Section */}
                <div className="section our-story">
                    <div className="text-content">
                        <h2 className="section-heading">Our Story</h2>
                        <p>
                            FitChck was started as a joint passion for fashion,
                            technology, and sustainability. As a group of
                            fashion-conscious developers, we noticed an
                            imbalance in the way people engage with their
                            wardrobes - leading to overconsumption and wasted
                            resources. It is essential for fashionistas to have
                            a product that not only helps them organize their
                            clothes, but it also inspires them to make
                            sustainable choices. With recommendations for their
                            clothes, users are encouraged to share and interact
                            on the FitChck site. FitChck makes it easier to buy
                            the best clothing for their lives.
                        </p>
                    </div>
                    <img src={ourStoryImage} alt="Our Story" className="section-image" />
                </div>

                {/* Our Mission Section */}
                <div className="section our-mission">
                    <img src={ourMissionImage} alt="Our Mission" className="section-image" />
                    <div className="text-content">
                        <h2 className="section-heading">Our Mission</h2>
                        <p>
                            At FitChck, our mission is to simplify the way
                            people think about fashion by making it sustainable
                            and better supported by communities. We believe
                            that style should be both expressive and ethical.
                            So we help users create wardrobes, discover outfit
                            possibilities, and connect with like-minded fashion
                            enthusiasts. We aim to cut the amount of fashion
                            waste and encourage a more responsible fashion
                            approach by promoting conscious shopping choices
                            and supplying resources.
                        </p>
                    </div>
                </div>

                {/* Our Team Section */}
                <div className="our-team">
                    <h2 className="section-heading">Our Team</h2>
                    <div className="team-members">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-member">
                                <img src={member.image} alt={member.name} className="team-image" />
                                <p>{member.name}</p>
                                <p className="team-info"><em>{member.university}</em></p>
                                <p className="team-info"><em>{member.year}, {member.major}</em></p>
                            </div>
                        ))}
                    </div>
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
    );
}

export default AboutPage;
