import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketInstance } from "../types/socket";
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
				msg.textContent = payload;
				messages?.appendChild(msg);
			});
		});
	}, []);

	const sendMsg = () => {
		if (socket && socket.connected && chatId) {
			socket.emit("chat", input);
			setInput("");
		}
	}

    return (
        <div className="flex flex-col items-center h-full w-5/6">
            <div className="h-full w-full">
                <div className="flex flex-col justify-end self-center w-full h-full p-10">
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
            <div className="h-min w-full">
                <div className="flex px-10">
                    <button className="flex justify-center items-center w-10">
                        <BsThreeDotsVertical/>
                    </button>
                    <form 
                        className="flex flex-row w-full my-7 mr-4 border border-gray/70 rounded-lg bottom-4 
                        outline-transparent"
                        onSubmit={sendMsg}
                        >
                        <div className="w-full p-2">
                            <input 
                                type="text"
                                value={input} 
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }} 
                                className="outline-transparent rounded-lg w-full"
                            />
                        </div>
                        <div className="flex justify-end p-1">
                            <input
                                type="submit"
                                value="Send"
                                className="hover:outline-blue bg-send-button focus:ring-4 text-white 
                                text-center w-20 p-1 rounded-lg font-medium"
                            />                         
                        </div>        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Chat
