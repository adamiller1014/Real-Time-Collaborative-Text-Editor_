import React from "react";
import Editor from "./components/Editor";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow overflow-hidden">
        <Editor className="flex-grow" />
        <Chat className="w-1/3 bg-gray-100 p-4" />
      </div>
    </div>
  );
}

export default App;
