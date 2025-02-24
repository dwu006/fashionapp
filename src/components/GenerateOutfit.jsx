import { useState } from "react";
import axios from "axios";
import "../styles/ChatBot.css";

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
        // Auto-resize the textarea
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
                    <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
    );
}

function GenerateOutfit() {
    const [messages, setMessages] = useState([]);

    async function handleSubmit(message) {
        try {
            const { data } = await axios.post('http://localhost:5000/ai', { prompt: message }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMessages([...messages, { type: 'user', content: message }, { type: 'ai', content: data.data }]);
        }
        catch (error) {
            console.error('Error generating outfit:', error);
            alert('Failed to generate outfit: ' + error.message);
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
            </div>
            <ControlledEditableDiv sendMessage={handleSubmit} />
        </div>
    );
}

export default GenerateOutfit;