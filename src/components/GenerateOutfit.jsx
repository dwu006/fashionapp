import { useState } from "react";
import axios from "axios";
import "../styles/ChatBot.css";

function ControlledEditableDiv({ sendMessage }) {
    const [content, setContent] = useState('');

    return (
        <div style={{
            position: 'relative',
            border: '2px solid #333',
            padding: '12px',
            minHeight: '100px',
            borderRadius: '10px',
            width: '100%'
        }}>
            <textarea
                className="textbox"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(content);
                        setContent(' ');
                    }
                }}
                placeholder="Type here..."
            />
            <button className="button" style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                padding: '8px 16px',
                borderRadius: '5px',
            }} onClick={() => {
                sendMessage(content);
                setContent(' ');
            }}>
                Send
            </button>
        </div>
    );
}



function GenerateOutfit() {
    const [fileUrl, setFileUrl] = useState('');
    const [messages, setMessages] = useState([]);

    async function handleSubmit(message) {
        console.log("Message sent: ", message);
        try {
            const { data } = await axios.post('http://localhost:5001/ai', { prompt: message }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("what we got: ", data);
            setMessages([...messages, [data.data, message]]);
            console.log("What we have so far: ", messages);
        }
        catch (error) {
            console.error('Error generating outfit:', error);
            alert('Failed to generate outfit: ' + error.message);
        }

    }

    const messagesSoFar = messages.map(([message, req]) => {
        let request = req;
        let text = message;
        return (
            <li key={req}>
                <p>You asked: {request}</p>
                <p>AI responded: {text}</p>
            </li>
        )
    })


    return (
        <div>
            <div style={{
                height: '200px',
                overflowY: 'auto'
            }}>
                <ol>{messagesSoFar}</ol>
            </div>
            <ControlledEditableDiv sendMessage={handleSubmit} />
        </div>
    )
}

export default GenerateOutfit;