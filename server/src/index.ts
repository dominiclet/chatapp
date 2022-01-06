import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors())
const port = 5000;
const httpServer = createServer(app);
const pairingQueue: string[] = [];

const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		allowedHeaders: ["*"],
	}
})

app.get('/', (_, res) => {
  res.status(200).send("Hello");
});

io.on("connection", (socket) => {
	console.log("New connection by", socket.id)

	if (pairingQueue.length == 0) pairingQueue.push(socket.id);
	else {
		const matched = pairingQueue.shift();
		// Emit pair messages 
		socket.emit("pair", matched);
		io.to(matched).emit("pair", socket.id);
		console.log(`Paired ${socket.id} with ${matched}`)
		// Set to listen for each other's sockets 
		const otherSocket = io.sockets.sockets.get(matched);
		socket.on("chat", (msg) => {
			io.to(matched).to(socket.id).emit("chat", msg);
		})
		otherSocket.on("chat", (msg) => {
			io.to(socket.id).to(matched).emit("chat", msg);
		})
	}

	socket.on("disconnect", (reason) => {
		console.log(`${socket.id} has disconnected (Reason: ${reason})`);
	})
})

httpServer.listen(port, () => console.log(`Running on port ${port}`));