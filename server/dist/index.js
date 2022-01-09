"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const httpServer = (0, http_1.createServer)(app);
const pairingQueue = [];
console.log(process.env.FRONTEND_URL);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
    }
});
app.get('/', (_, res) => {
    res.status(200).send("Hello");
});
io.on("connection", (socket) => {
    console.log(`New connection by ${socket.id}, adding to pairing queue...`);
    socket.on("pair", (payload) => {
        pairingQueue.push({
            id: socket.id,
            name: payload,
        });
    });
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} has disconnected (Reason: ${reason})`);
        if (pairingQueue.length > 0) {
            for (let i = 0; i < pairingQueue.length; i++) {
                if (pairingQueue[i].id == socket.id) {
                    pairingQueue.splice(i, 1);
                    return;
                }
            }
        }
    });
});
// Pairing loop
setInterval(() => {
    if (pairingQueue.length <= 1)
        return;
    const pairReq1 = pairingQueue.shift();
    const pairReq2 = pairingQueue.shift();
    const match1Id = pairReq1.id;
    const match2Id = pairReq2.id;
    // Check if sockets are still connected
    const match1 = io.sockets.sockets.get(match1Id);
    const match2 = io.sockets.sockets.get(match2Id);
    if (!match1 && match2) {
        pairingQueue.push(pairReq2);
        return;
    }
    else if (!match2 && match1) {
        pairingQueue.push(pairReq1);
        return;
    }
    else if (!match1 && !match2) {
        return;
    }
    // Emit pair messages
    match1.emit("pair", pairReq2.name);
    match2.emit("pair", pairReq1.name);
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
        io.to(match2Id).emit("announce", `${match1Id} has disconnected, finding you a new chat buddy...`);
        match2.removeAllListeners("chat");
        pairingQueue.push(pairReq2);
    });
    match2.on("disconnect", () => {
        io.to(match1Id).emit("announce", `${match2Id} has disconnected, finding you a new chat buddy...`);
        match1.removeAllListeners("chat");
        pairingQueue.push(pairReq1);
    });
}, 3000);
httpServer.listen(port, () => console.log(`Running on port ${port}`));
//# sourceMappingURL=index.js.map