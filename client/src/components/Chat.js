import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data.content]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit(
        "send_message",
        JSON.stringify({ content: message, type: "chat_message" })
      );
      setMessages((prev) => [...prev, message]);
      setMessage("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="bg-blue-100 p-2 mb-2 rounded shadow">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-l"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
