import { useState, useEffect } from "react";
import UploadClothes from "./UploadClothes.jsx";
import axios from "axios";
import "../styles/ChatBot.css";
import "../styles/UploadClothes.css";
import camera from "../assets/camera.svg";

async function handleSubmit(userId, message, latitude, longitude, setLoading, setMessages) {
    try {
        setLoading(true);
        const { data } = message.includes("outfit") ? await axios.post(
            'http://localhost:5001/ai/image_idea',
            {
                userId: userId,
                prompt: message,
                latitude: latitude,
                longitude: longitude
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
            : await axios.post(
                'http://localhost:5001/ai',
                {
                    userId: userId,
                    prompt: message,
                    latitude,
                    longitude
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

        console.log(data);
        var formattedResponse = data.data;
        var imagesSent = data.images;

        if (message.includes("outfit")) {
            // Format the outfit recommendation
            const outfitData = data.data;
            const weatherInfo = data.weather;
            var arrayOfImages = [];

            formattedResponse = `Weather: ${weatherInfo.temperature}°F, ${weatherInfo.condition}

            Recommended Outfit:
            ${outfitData.top ? `• Top: ${outfitData.top}` : ''}\n
            ${outfitData.bottom ? `• Bottom: ${outfitData.bottom}` : ''}\n
            ${outfitData.outerwear ? `• Outerwear: ${outfitData.outerwear}` : ''}\n
            ${outfitData.shoes ? `• Shoes: ${outfitData.shoes}` : ''}\n
            ${outfitData.accessories ? `• Accessories: ${outfitData.accessories}` : ''}\n

            Styling Notes: ${outfitData.explanation}`;

            if (imagesSent) {
                for (let i = 0; i < imagesSent.length; i++) {
                    if (imagesSent[i].image) {
                        arrayOfImages.push(imagesSent[i].image)
                    }
                }
            }
            imagesSent = arrayOfImages;

        }


        if (!data || !data.data) {
            throw new Error("Invalid response format from server");
        }

        // Save messages
        setMessages(prevMessages => {
            if (!Array.isArray(prevMessages)) {
                console.error("prevMessages is not an Array")
            }
            return [
                ...prevMessages,
                { type: 'user', content: message }, { type: 'ai', content: [formattedResponse, imagesSent] }
            ];
        });

    } catch (error) {
        console.error('Error generating outfit:', error);
        alert('Failed to generate outfit: ' + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);  // Hide loading state
    }
}


async function handleImageSubmit(userId, message, imageFile, latitude, longitude, selectedCategory, setLoading, setMessages) {
    try {
        setLoading(true);

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('userId', userId);
        formData.append('prompt', message);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('category', selectedCategory);

        const { data } = await axios.post(
            'http://localhost:5001/ai/analyze_image',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (!data) {
            throw new Error("Invalid response format from server");
        }

        console.log("Response data:", data);
        var imagesSent = data.images;
        var formattedResponse = '';

        // Format the outfit recommendation
        const outfitData = data.outfit;
        var arrayOfImages = [];

        formattedResponse = `Recommended Outfit:
            ${outfitData.top ? `• Top: ${outfitData.top}` : ''}\n
            ${outfitData.bottom ? `• Bottom: ${outfitData.bottom}` : ''}\n
            ${outfitData.outerwear ? `• Outerwear: ${outfitData.outerwear}` : ''}\n
            ${outfitData.shoes ? `• Shoes: ${outfitData.shoes}` : ''}\n
            ${outfitData.accessories ? `• Accessories: ${outfitData.accessories}` : ''}\n

            Styling Notes: ${outfitData.explanation}`;

        if (imagesSent) {
            for (let i = 0; i < imagesSent.length; i++) {
                if (imagesSent[i].image) {
                    arrayOfImages.push(imagesSent[i].image)
                }
            }
        }
        imagesSent = arrayOfImages;


        const imageURL = typeof imageFile != 'string' ? URL.createObjectURL(imageFile) : imageFile;
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                type: 'user',
                content: message,
                imageURL: imageURL
            },
            {
                type: 'ai',
                content: [formattedResponse, imagesSent]
            }
        ]);

    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
        setLoading(false);
    }
}

function ControlledEditableDiv({ sentImage, setSentImages, sendMessage, sendImageMessage }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(sentImage);
    const [file, setFile] = useState(sentImage); // Added a file state
    const [imageSettings, setImageSettings] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('other');

    useEffect(() => {
        setImage(sentImage);
        setFile(sentImage);
    }, [sentImage]);

    const handleSend = () => {
        if (content.trim()) {
            if (file) {
                sendImageMessage(content, file, selectedCategory);
            } else {
                sendMessage(content);
            }
            setImage(null);
            setFile(null);
            setSentImages(null);
            setContent('');
            setSelectedCategory('other');
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const handleImageUpload = (file, category) => {
        setFile(file);
        setSelectedCategory(category);
        setImage(URL.createObjectURL(file));
    }

    return (
        <>
            <div className="chat-container">
                <textarea
                    className="textbox"
                    value={content}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Describe the outfit you want (e.g., 'casual outfit for a coffee date')"
                    rows={1}
                />
                <div className="image-div">
                    <button
                        className="image-button"
                        onClick={() => setImageSettings(!imageSettings)}
                        title="Upload image"
                    >
                        <img src={camera} alt="Upload image" />
                    </button>
                    {image && <img
                        src={image}
                        alt="Preview"
                        className="image-preview"
                        onClick={() => {
                            setImage(null);
                            setFile(null);
                        }} />}
                </div>
                <button
                    className="send-button"
                    onClick={handleSend}
                    title="Generate outfit"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
            {imageSettings && (
                <UploadClothes setShowUploadModal={setImageSettings} onUploadSuccess={handleImageUpload} />
            )}
        </>
    );
}

function formatUserMessage({ message }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
        }}>
            {message.content}
            {message.imageURL && <img src={message.imageURL} alt="Uploaded" className="uploaded-image" />}
        </div>
    );
}

function formatAIMessage({ message }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: message.type === 'user' ? 'flex-end' : 'flex-start'
        }}>
            {Array.isArray(message.content) ? message.content[0] : message.content}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '10px'
            }} >
                {Array.isArray(message.content[1]) &&
                    message.content[1].map((image, index) => (
                        <img
                            key={index}
                            src={`data:image/jpeg;base64,${image}`} // Ensure correct base64 format
                            alt={`Generated ${index}`}
                            className="generated-image"
                        />
                    ))}
            </div>

        </div >
    );
}

function GenerateOutfit({ userId, image = null }) {
    const [messages, setMessages] = useState([]);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sentImage, setSentImages] = useState(image);

    useEffect(() => {
        setSentImages(image);
    }, [image]);


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLocation({
                        lat: 34.0522,
                        lon: -118.2437,
                    });
                }
            );
        }
    }, []);

    return (
        <div className="outfit-generator">
            <div className="messages-container">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <p>Describe what kind of outfit you're looking for, and I'll help you create the perfect look from your wardrobe!</p>
                    </div>
                )}
                {Array.isArray(messages) &&
                    messages.map((message, index) => (
                        <div key={index} className="message">
                            <div className={message.type === 'user' ? 'message-user' : 'message-ai'}>
                                <strong>{message.type === 'user' ? 'You: ' : 'AI: '}</strong>
                                {message.type === 'user' ? (formatUserMessage({ message })) : (formatAIMessage({ message }))}
                            </div>
                        </div>
                    ))}
                {loading && (
                    <div className="message">
                        <div className="message-ai">
                            <div className="loading">Generating your outfit...</div>
                        </div>
                    </div>
                )}
            </div>
            {location ? (
                <ControlledEditableDiv
                    sentImage={sentImage}
                    setSentImages={setSentImages}
                    sendMessage={(message) =>
                        handleSubmit(userId, message, location.lat, location.lon, setLoading, setMessages)
                    }
                    sendImageMessage={(message, image, category) =>
                        handleImageSubmit(userId, message, image, location.lat, location.lon, category, setLoading, setMessages)
                    }
                />
            ) : (
                <ControlledEditableDiv
                    sentImage={sentImage}
                    setSentImages={setSentImages}
                    sendMessage={(message) => handleSubmit(userId, message, null, null, setLoading, setMessages)}
                    sendImageMessage={(message, image, category) =>
                        handleImageSubmit(userId, message, image, null, null, category, setLoading, setMessages)
                    }
                />
            )}
        </div>
    );
}

export default GenerateOutfit;