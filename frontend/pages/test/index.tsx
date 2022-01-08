import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { message, SocketInstance } from "../../types/socket";

const test = () => {
	const [socket, setSocket] = useState<SocketInstance|undefined>();
	const [chatId, setChatId] = useState<string|undefined>();
	const [input, setInput] = useState<string>("");

	useEffect(() => {
		const socket = io("http://localhost:5000");
		setSocket(socket);
		const messages = document.getElementById("messages");

		socket.on("connect", () => {
			const msg = document.createElement("li");
			msg.textContent = `Your ID is ${socket.id}, pairing you with someone...`;
			messages?.appendChild(msg);

			socket.on("pair", (matchedId) => {
				const msg = document.createElement("li");
				msg.textContent = `You are matched with ${matchedId}`;
				messages?.appendChild(msg);
				setChatId(matchedId);
			});
			socket.on("chat", (payload) => {
				const msg = document.createElement("li");
				msg.textContent = `${payload.name}: ${payload.content}`;
				messages?.appendChild(msg);
			});
		});
	}, []);

	const sendMsg = () => {
		if (socket && socket.connected && chatId) {
			const message: message = {
				name: "Name",
				content: input
			}
			socket.emit("chat", message);
			setInput("");
		}
	}

	return (
		<div className="flex flex-col content-between w-full h-full">
			<div id="messages" className="self-center w-5/6 h-5 py-10">
			</div>
			<div className="absolute w-full bottom-4">
				<input 
					value={input} 
					onChange={(e) => {
						setInput(e.target.value);
					}} 
					className="w-5/6 p-2 ml-5 border border-solid bottom-4" 
					onKeyPress={(event) => {
						if (event.key === "Enter") sendMsg();
					}}
				/>
			</div>
		</div>
	);
}
export default test 