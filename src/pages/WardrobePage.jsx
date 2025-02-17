import React from "react";
import Header from "../components/Header.jsx";
import UserHeader from "../components/UserHeader.jsx";
import Footer from "../components/Footer.jsx";
import UploadClothes from "../components/UploadClothes.jsx";
import WardrobeGrid from "../components/WardrobeGrid.jsx";

function WardrobePage() {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <div className="min-h-screen flex flex-col">
            {isAuthenticated ? <UserHeader /> : <Header />}
            <main className="flex-grow">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-center my-8">My Wardrobe</h1>
                    <UploadClothes />
                    <WardrobeGrid />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default WardrobePage;