import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Editor() {
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receive_text", (data) => {
      setText(data.content);
    });

    return () => {
      socket.off("receive_text");
    };
  }, []);

  const handleChange = (e) => {
    const newText = e.target.innerHTML;
    setText(newText);
    socket.emit(
      "send_text",
      JSON.stringify({ content: newText, type: "text_update" })
    );
  };

  const handleBold = () => {
    document.execCommand("bold");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex mb-2">
        <button
          onClick={handleBold}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Bold
        </button>
      </div>
      <div
        contentEditable="true"
        className="flex-grow p-4 border border-gray-300 rounded shadow-md bg-white overflow-y-auto"
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

export default Editor;
