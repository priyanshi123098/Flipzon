import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Start a new session when the component mounts
        setMessages([{ sender: 'bot', text: 'Hello! How can I assist you today?' }]);
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSend = async () => {

        if (input.trim() === '') return;
        const newMessage = { sender: 'user', text: input };
        setMessages([...messages, newMessage]);
        setInput('');
        console.log('Messages before API call:', messages);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
                message: input,
                conversation: messages,
            });
            console.log('API response:', response.data);
            const botResponseText = response.data.response; // Access the response property

        // Check if the response text is valid
        if (!botResponseText) {
            throw new Error('Invalid response format from API');
        }

        // Create a new message object for the bot's response
        const botMessage = { sender: 'bot', text: botResponseText };
        setMessages(prevMessages => [...prevMessages, botMessage]); 

        } catch (error) {

            console.error('Error sending message:', error);

        }

    };

    return (
        <div className={styles.chat_container}>
            <div className={styles.chat_window}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'bot' ? styles.bot_message : styles.user_message}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className={styles.input_container}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className={styles.input}
                />
                <button onClick={handleSend} className={styles.send_button}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
