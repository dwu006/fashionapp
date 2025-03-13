import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ChatBot.css";

function GenerateOutfit({ userId }) {
    const [messages, setMessages] = useState([]);
    const [location, setLocation] = useState({ lat: 34.0522, lon: -118.2437 });
    const [loading, setLoading] = useState(false);
    const [wardrobeCount, setWardrobeCount] = useState(0);

    useEffect(() => {
        // Get user's location
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
                    // Default to Los Angeles
                    setLocation({
                        lat: 34.0522,
                        lon: -118.2437,
                    });
                }
            );
        }

        // Check if user has items in wardrobe
        const checkWardrobe = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                
                const response = await axios.get("http://localhost:5001/wardrobe", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                setWardrobeCount(response.data.length);
            } catch (error) {
                console.error("Error checking wardrobe:", error);
            }
        };
        
        checkWardrobe();
    }, []);

    async function handleSubmit(message) {
        try {
            setLoading(true);
            console.log(`Generating outfit with prompt: "${message}" for user: ${userId}`);
            
            const { data } = await axios.post(
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
            );

        var formattedResponse = data.data;

        if (message.includes("outfit")) {
            // Format the outfit recommendation
            const outfitData = data.data;
            const weatherInfo = data.weather;
            
            // Format the response for display
            let formattedResponse = '';
            
            if (weatherInfo) {
                formattedResponse += `Weather: ${weatherInfo.temperature}°F, ${weatherInfo.condition}\n\n`;
            }
            
            // Only add the category header if there are items to display
            const hasOutfitItems = outfitData.top || outfitData.bottom || outfitData.outerwear || 
                                  outfitData.shoes || outfitData.accessories;
            
            if (hasOutfitItems) {
                formattedResponse += "Recommended Outfit:\n";
                
                // Only add items that exist
                if (outfitData.top) formattedResponse += `• ${outfitData.top}\n`;
                if (outfitData.bottom) formattedResponse += `• ${outfitData.bottom}\n`;
                if (outfitData.outerwear) formattedResponse += `• ${outfitData.outerwear}\n`;
                if (outfitData.shoes) formattedResponse += `• ${outfitData.shoes}\n`;
                if (outfitData.accessories) formattedResponse += `• ${outfitData.accessories}\n`;
            } else {
                formattedResponse += "No suitable items found in your wardrobe for this occasion.\n";
            }
            
            if (outfitData.explanation) {
                formattedResponse += `\nStyling Notes: ${outfitData.explanation}`;
            }
    
            // Save messages
            setMessages(prevMessages => [
                ...prevMessages,
                { 
                    type: 'user', 
                    content: message
                }, 
                { 
                    type: 'ai', 
                    content: formattedResponse
                }
            ]);
    
        } catch (error) {
            console.error('Error generating outfit:', error);
            
            const errorMessage = error.response?.data?.message || error.message || "Failed to generate outfit";
            
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'user', content: message },
                { type: 'ai', content: `Sorry, I couldn't generate an outfit: ${errorMessage}. Please try again with a different prompt.` }
            ]);
        } finally {
            setLoading(false);
        }
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
                    placeholder="Describe the event or occasion (e.g., 'Business meeting', 'Coffee date', 'Weekend brunch')"
                    rows={1}
                />
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

    return (
        <div className="outfit-generator">
            <div className="messages-container">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <p>Describe an occasion or event (like "date night", "job interview", or "beach day"), and I'll help you create the perfect outfit from your wardrobe!</p>
                        {wardrobeCount === 0 && (
                            <p className="wardrobe-warning">⚠️ You don't have any clothes in your wardrobe yet. Please add some items to get personalized recommendations.</p>
                        )}
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        <div className={`message-${message.type}-content`}>
                            <strong>{message.type === 'user' ? 'You: ' : 'AI: '}</strong>
                            <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message ai">
                        <div className="message-ai-content">
                            <div className="loading">Generating your outfit</div>
                        </div>
                    </div>
                )}
            </div>
            
            <ControlledEditableDiv
                sendMessage={handleSubmit}
            />
        </div>
    );
}

export default GenerateOutfit;