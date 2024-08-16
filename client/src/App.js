// client/src/App.js

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    socket.on("text_update", (newContent) => {
      setContent(newContent);
    });

    socket.on("chat_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("text_update");
      socket.off("chat_message");
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setContent(newText);
    socket.emit("text_update", newText);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    socket.emit("chat_message", chatInput);
    setChatInput("");
  };

  return (
    <div className="app-container">
      <div className="editor-container">
        <textarea
          className="editor"
          value={content}
          onChange={handleTextChange}
          placeholder="Start typing..."
        />
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit} className="chat-form">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button type="submit" className="chat-submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
