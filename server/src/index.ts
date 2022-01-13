import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from "socket.io";
import cors from "cors";
import { PairRequest } from './types/socket';

const app = express();
app.use(cors())
const port = 5000;
const httpServer = createServer(app);
const pairingQueue: PairRequest[] = [];

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
	console.log(`New connection by ${socket.id}, adding to pairing queue...`)

	socket.on("pair", (payload) => {
		pairingQueue.push({
			id: socket.id, 
			name: payload,
		})
	})

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
	})
})

// Pairing loop
setInterval(() => {
	if (pairingQueue.length <= 1) return;
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
	} else if (!match2 && match1) {
		pairingQueue.push(pairReq1);
		return;
	} else if (!match1 && !match2) {
		return;
	}

	// Emit pair messages
	match1.emit("pair", pairReq2.name);
	match2.emit("pair", pairReq1.name);
	console.log(`Paired ${match1Id} with ${match2Id}`)

	// Listen to each other's chats
	match1.on("chat", (msg) => {
		io.to(match2Id).to(match1Id).emit("chat", msg);
	});
	match2.on("chat", (msg) => {
		io.to(match1Id).to(match2Id).emit("chat", msg);
	});

	// Handle disconnect events
	match1.on("disconnect", () => {
		io.to(match2Id).emit("announce", `${pairReq1.name} has disconnected, finding you a new chat buddy...`);
		match2.removeAllListeners("chat");
		pairingQueue.push(pairReq2);
	})
	match2.on("disconnect", () => {
		io.to(match1Id).emit("announce", `${pairReq2.name} has disconnected, finding you a new chat buddy...`);
		match1.removeAllListeners("chat");
		pairingQueue.push(pairReq1);
	})
}, 3000)

httpServer.listen(port, () => console.log(`Running on port ${port}`));