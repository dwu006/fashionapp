import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ChatBot.css";

function OutfitDisplay({ image }) {
    return (
        <div className="outfit-display">
            {image && (
                <img src={image} alt="Generated Outfit" />
            )}
        </div>
    );
}


function ControlledEditableDiv({ sendMessage }) {
    const [content, setContent] = useState('');

    const handleSend = () => {
        if (content.trim()) {
            sendMessage(content);
            setContent('');
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
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
                placeholder="Message AI..."
                rows={1}
            />
            <button
                className="send-button"
                onClick={handleSend}
                title="Send message"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}

function GenerateOutfit({ userId }) {
    const [messages, setMessages] = useState([]);
    const [images, setImages] = useState([]);  // This will store the image(s) returned
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                () => {
                    // Default to Cupertino if location access is denied
                    fetchWeather(37.3229, -122.0322);
                    setCity("Cupertino");
                }
            );
        } else {
            fetchWeather(37.3229, -122.0322);
            setCity("Cupertino");
        }
    }, [latitude, longitude]);

    async function handleSubmit(userId, message, latitude, longitude) {
        try {
            setLoading(true);  

            const { data } = await axios.post(
                'http://localhost:5001/ai',
                {
                    userId,
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

            console.log("AI Response:", data);

            if (!data || !data.data) {
                throw new Error("Invalid response format from server");
            }

            // Save messages
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'user', content: message }
            ]);
            
            // Assuming data.data contains both text and image URL or base64 string
            setImages(prev => [
                ...prev,
                { type: 'ai', content: data.data }  // Store image or object here
            ]);
        } catch (error) {
            console.error('Error generating outfit:', error);
            alert('Failed to generate outfit: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);  // Hide loading state
        }
    }

    return (
        <div>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <div className={message.type === 'user' ? 'message-user' : 'message-ai'}>
                            <strong>{message.type === 'user' ? 'You: ' : 'AI: '}</strong>
                            {message.content}
                        </div>
                    </div>
                ))}
                <div className="outfit-display-container">
                    {images.length > 0 && images.map((img, index) => (
                        <div key={index}>
                            {img.type === 'ai' && (
                                <OutfitDisplay 
                                    image={img.content}  // Assuming img.content is an image URL or base64 string
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <ControlledEditableDiv sendMessage={(message) => handleSubmit(userId, message, latitude, longitude)} />
        </div>
    );
}


export default GenerateOutfit;