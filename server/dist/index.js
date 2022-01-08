"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 5000;
const httpServer = (0, http_1.createServer)(app);
const pairingQueue = [];
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
    }
});
app.get('/', (_, res) => {
    res.status(200).send("Hello");
});
io.on("connection", (socket) => {
    console.log(`New connection by ${socket.id}, adding to pairing queue...`);
    pairingQueue.push(socket.id);
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} has disconnected (Reason: ${reason})`);
        if (pairingQueue[0] == socket.id)
            pairingQueue.pop();
    });
});
// Pairing loop
setInterval(() => {
    if (pairingQueue.length <= 1)
        return;
    const match1Id = pairingQueue.shift();
    const match2Id = pairingQueue.shift();
    // Check if sockets are still connected
    const match1 = io.sockets.sockets.get(match1Id);
    const match2 = io.sockets.sockets.get(match2Id);
    if (!match1 && match2) {
        pairingQueue.push(match2Id);
        return;
    }
    else if (!match2 && match1) {
        pairingQueue.push(match1Id);
        return;
    }
    else if (!match1 && !match2) {
        return;
    }
    // Emit pair messages
    match1.emit("pair", match2Id);
    match2.emit("pair", match1Id);
    console.log(`Paired ${match1Id} with ${match2Id}`);
    // Listen to each other's chats
    match1.on("chat", (msg) => {
        io.to(match2Id).to(match1Id).emit("chat", msg);
    });
    match2.on("chat", (msg) => {
        io.to(match1Id).to(match2Id).emit("chat", msg);
    });
    // Handle disconnect events
    match1.on("disconnect", () => {
        io.to(match2Id).emit("chat", `${match1Id} has disconnected, finding you a new chat partner...`);
        pairingQueue.push(match2Id);
    });
    match2.on("disconnect", () => {
        io.to(match1Id).emit("chat", `${match2Id} has disconnected, finding you a new chat partner...`);
        pairingQueue.push(match1Id);
    });
}, 3000);
httpServer.listen(port, () => console.log(`Running on port ${port}`));
//# sourceMappingURL=index.js.map