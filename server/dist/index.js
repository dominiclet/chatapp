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
    console.log("New connection by", socket.id);
    socket.on("chat", (arg) => {
        io.emit("chat", arg);
    });
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} has disconnected (Reason: ${reason})`);
    });
});
httpServer.listen(port, () => console.log(`Running on port ${port}`));
//# sourceMappingURL=index.js.map