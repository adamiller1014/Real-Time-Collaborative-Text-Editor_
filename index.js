// server/index.js

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your React frontend
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/collab-editor", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const DocumentSchema = new mongoose.Schema(
  {
    content: String,
    version: Number,
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", DocumentSchema);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("text_update", async (content) => {
    // Broadcast message to all clients except the sender
    socket.broadcast.emit("text_update", content);

    // Save to database (version control)
    const latestDoc = await Document.findOne().sort({ version: -1 });
    const newVersion = latestDoc ? latestDoc.version + 1 : 1;
    const newDoc = new Document({ content, version: newVersion });
    await newDoc.save();
  });

  socket.on("chat_message", (message) => {
    // Broadcast chat message to all clients
    io.emit("chat_message", message);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
