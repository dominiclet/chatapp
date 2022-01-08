import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { message, SocketInstance } from "../types/socket";
import {BsThreeDotsVertical} from 'react-icons/bs';
import TextBubble from "./TextBubble";

interface Props {
    username: string;
}

const Chat = (props: Props) => {
	const [socket, setSocket] = useState<SocketInstance|undefined>();
	const [chatId, setChatId] = useState<string|undefined>();
	const [input, setInput] = useState<string>(""); 
    const [msgs, setMsgs] = useState<string[]>([]);
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
                setMsgs((currMsgs) => {
                    return [...currMsgs, payload.content];
                });
                const elem = document.getElementById("messages");
                (elem as HTMLElement).scrollTop = (elem as HTMLElement).scrollHeight;
			});
		});
	}, []);

    console.log(msgs);

	const sendMsg = () => {
		if (socket && socket.connected && chatId && input != "") {
            const message: message = {
                name: props.username,
                content: input,
            }
			socket.emit("chat", message);
			setInput("");
		}
	}

    return (
        <div className="flex flex-col items-center w-5/6 h-screen">
            <div className="flex flex-col self-center w-full h-full overflow-y-scroll" id="messages">
                <div className="flex justify-center p-3">
                    <button disabled={true} className="rounded-lg bg-date-button text-white text-sm px-7 py-0.5">
                        {d.getDate()}/{d.getMonth()+1}/{d.getFullYear()}
                    </button>                        
                </div>
                {msgs.map((msg) => {
                    return <TextBubble textContent={msg} />
                })}
                <TextBubble textContent={"hello"} self={true}/>
                <TextBubble textContent={"hi"} self={false}/>
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
