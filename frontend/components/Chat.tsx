import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { message, SocketInstance } from "../types/socket";
import {BsThreeDotsVertical} from 'react-icons/bs';
import TextBubble from "./TextBubble";

const Chat = () => {
	const [socket, setSocket] = useState<SocketInstance|undefined>();
	const [chatId, setChatId] = useState<string|undefined>();
	const [input, setInput] = useState<string>(""); 
    const d = new Date();

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
                content: input,
            }
			socket.emit("chat", input);
			setInput("");
		}
	}

    return (
        <div className="flex flex-col items-center w-5/6 h-full">
            <div className="w-full h-full">
                <div className="flex flex-col self-center justify-end w-full h-full p-10">
                    <div className="flex justify-center p-3">
                        <button disabled={true} className="rounded-lg bg-date-button text-white text-sm px-7 py-0.5">
                            {d.getDate()}/{d.getMonth()+1}/{d.getFullYear()}
                        </button>                        
                    </div>
                    <div id="messages">
                        <TextBubble self={true}/>
                        <TextBubble self={false}/>
                    </div>
                </div>
            </div>
            <div className="w-full h-min">
                <div className="flex px-10">
                    <button className="flex items-center justify-center w-10">
                        <BsThreeDotsVertical/>
                    </button>
                    <div 
                        className="flex flex-row w-full mr-4 border rounded-lg my-7 border-gray/70 bottom-4 outline-transparent"
                        >
                        <div className="w-full p-2">
                            <input 
                                type="text"
                                value={input} 
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }} 
                                className="w-full rounded-lg outline-transparent"
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") sendMsg();
                                }}
                            />
                        </div>
                        <div className="flex justify-end p-1">
                            <input
                                type="submit"
                                value="Send"
                                className="w-20 p-1 font-medium text-center text-white rounded-lg hover:outline-blue bg-send-button focus:ring-4"
                            />                         
                        </div>        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
