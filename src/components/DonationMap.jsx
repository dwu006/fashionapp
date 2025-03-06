import React, { useState, useEffect } from "react";

const DonationMap = () => {
    const [userLocation, setUserLocation] = useState(null);
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => console.error("Error getting user location:", error)
        );
    }, []);

    return (
        <div className="donation-map">
            {userLocation ? (
                <iframe
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/search?key=${googleMapsApiKey}&q=clothing+donation+near+${userLocation.lat},${userLocation.lng}`}
                ></iframe>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};

export default DonationMap;
