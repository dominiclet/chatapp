import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors())
const port = 5000;
const httpServer = createServer(app);

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

	socket.on("chat", (arg) => {
		io.emit("chat", arg);
	})

	socket.on("disconnect", (reason) => {
		console.log(`${socket.id} has disconnected (Reason: ${reason})`);
	})
})

httpServer.listen(port, () => console.log(`Running on port ${port}`));