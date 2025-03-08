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
                placeholder="Describe the outfit you want (e.g., 'casual outfit for a coffee date')"
                rows={1}
            />
            {/* <button
                className="image-button"
                onClick={handleSend}
                title="Send message"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
                </svg>
            </button> */}
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
    );
}

function GenerateOutfit({ userId }) {
    const [messages, setMessages] = useState([]);
    const [location, setLocation] = useState(null);
    // const [images, setImages] = useState([]);  // This will store the image(s) returned
    // const [latitude, setLatitude] = useState('');
    // const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get user's location when component mounts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // Default to Los Angeles coordinates if location access is denied
                    setLocation({
                        lat: 34.0522,
                        lon: -118.2437
                    });
                }
            );
        }
    }, []);

    async function handleSubmit(userId, message, latitude, longitude) {
        try {
            setLoading(true);
            const { data } = message.includes("outfit") ? await axios.post(
                'http://localhost:5001/ai/image_idea',
                {
                    userId,
                    prompt: message,
                    latitude: location.lat,
                    longitude: location.lon
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

            var formattedResponse = data.data;

            if (message.includes("outfit")) {
                // Format the outfit recommendation
                const outfitData = data.outfit;
                const weatherInfo = data.weather;

                formattedResponse = `Weather: ${weatherInfo.temperature}°F, ${weatherInfo.condition}

                Recommended Outfit:
                ${outfitData.top ? `• Top: ${outfitData.top}` : ''}
                ${outfitData.bottom ? `• Bottom: ${outfitData.bottom}` : ''}
                ${outfitData.outerwear ? `• Outerwear: ${outfitData.outerwear}` : ''}
                ${outfitData.shoes ? `• Shoes: ${outfitData.shoes}` : ''}
                ${outfitData.accessories ? `• Accessories: ${outfitData.accessories}` : ''}

                Styling Notes: ${outfitData.explanation}`;
            }


            if (!data || !data.data) {
                throw new Error("Invalid response format from server");
            }

            // Save messages
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'user', content: message }, { type: 'ai', content: formattedResponse }
            ]);

        } catch (error) {
            console.error('Error generating outfit:', error);
            alert('Failed to generate outfit: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);  // Hide loading state
        }
    }

            // const [loading, setLoading] = useState(false);
            // const [location, setLocation] = useState(null);

            // useEffect(() => {
            //     // Get user's location when component mounts
            //     if (navigator.geolocation) {
            //         navigator.geolocation.getCurrentPosition(
            //             (position) => {
            //                 setLocation({
            //                     lat: position.coords.latitude,
            //                     lon: position.coords.longitude
            //                 });
            //             },
            //             (error) => {
            //                 console.error('Error getting location:', error);
            //                 // Default to Los Angeles coordinates if location access is denied
            //                 setLocation({
            //                     lat: 34.0522,
            //                     lon: -118.2437
            //                 });
            //             }
            //         );
            //     }
            // }, []);

            // async function handleSubmit(message) {
            //     if (!location) {
            //         alert('Location data is not yet available. Please try again in a moment.');
            //         return;
            //     }

            //     setLoading(true);
            //     try {
            //         const { data } = await axios.post('http://localhost:5000/ai/generate-outfit', {
            //             prompt: message,
            //             lat: location.lat,
            //             lon: location.lon
            //         }, {
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 'Authorization': `Bearer ${localStorage.getItem('token')}`
            //             }
            //         });

            //         // Format the outfit recommendation
            //         const outfitData = data.outfit;
            //         const weatherInfo = data.weather;

            //         const formattedResponse = `Weather: ${weatherInfo.temperature}°F, ${weatherInfo.condition}

            // Recommended Outfit:
            // ${outfitData.top ? `• Top: ${outfitData.top}` : ''}
            // ${outfitData.bottom ? `• Bottom: ${outfitData.bottom}` : ''}
            // ${outfitData.outerwear ? `• Outerwear: ${outfitData.outerwear}` : ''}
            // ${outfitData.shoes ? `• Shoes: ${outfitData.shoes}` : ''}
            // ${outfitData.accessories ? `• Accessories: ${outfitData.accessories}` : ''}

            // Styling Notes: ${outfitData.explanation}`;

            //         setMessages([...messages,
            //         { type: 'user', content: message },
            //         { type: 'ai', content: formattedResponse }
            //         ]);
            //     } catch (error) {
            //         console.error('Error generating outfit:', error);
            //         let errorMessage = 'Sorry, I encountered an error while generating your outfit.';

            //         if (error.response) {
            //             // Server responded with an error
            //             if (error.response.status === 401) {
            //                 errorMessage = 'Please log in to generate outfits.';
            //             } else if (error.response.data && error.response.data.message) {
            //                 errorMessage = error.response.data.message;
            //             }
            //         } else if (error.message === 'Network Error') {
            //             errorMessage = 'Unable to connect to the server. Please check your internet connection.';
            //         }

            //         setMessages([...messages,
            //         { type: 'user', content: message },
            //         { type: 'ai', content: errorMessage }
            //         ]);
            //     } finally {
            //         setLoading(false);
            //     }
            // }

            return (
                <div className="outfit-generator">
                    <div className="messages-container">
                        {messages.length === 0 && (
                            <div className="welcome-message">
                                <h3>AI Outfit Generator</h3>
                                <p>Describe what kind of outfit you're looking for, and I'll help you create the perfect look from your wardrobe!</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className="message">
                                <div className={message.type === 'user' ? 'message-user' : 'message-ai'}>
                                    <strong>{message.type === 'user' ? 'You: ' : 'AI: '}</strong>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{message.content}</pre>
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
            </div >
            <ControlledEditableDiv sendMessage={(message) => handleSubmit(userId, message, latitude, longitude)} />
        </div >
    );
    }


    export default GenerateOutfit;