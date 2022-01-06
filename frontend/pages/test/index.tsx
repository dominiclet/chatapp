import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketInstance } from "../../types/socket";

const test = () => {
	const [socket, setSocket] = useState<SocketInstance|undefined>();
	const [chat, setChat] = useState<string[]>([]);
	const [input, setInput] = useState<string>("");

	useEffect(() => {
		const socket = io("http://localhost:5000");
		setSocket(socket);
		const messages = document.getElementById("messages");

		socket.on("connect", () => {
			console.log('connected')
			
			socket.on("Hello", (arg) => {
				console.log("Received: ", arg)
			})

			socket.on("chat", (arg) => {
				const item = document.createElement('li');
				item.textContent = arg;
				messages?.appendChild(item);
			})
		})
	}, []);

	const sendMsg = () => {
		if (socket && socket.connected) {
			socket.emit("chat", input);
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
	)
}
export default test 