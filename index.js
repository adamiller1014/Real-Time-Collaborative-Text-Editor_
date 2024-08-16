const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors"); // Import the cors package

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Use CORS middleware
app.use(cors());

mongoose.connect("mongodb://localhost:27017/collab-editor", {
  // Remove deprecated options
});

app.use(express.json());

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const { content, type } = JSON.parse(message);
    if (type === "text_update") {
      // Broadcast message to all clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ content, type }));
        }
      });

      // Save to database (version control)
      const latestDoc = await Document.findOne().sort({ version: -1 });
      const newVersion = latestDoc ? latestDoc.version + 1 : 1;
      const newDoc = new Document({ content, version: newVersion });
      await newDoc.save();
    } else if (type === "chat_message") {
      // Broadcast chat message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ content, type }));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
