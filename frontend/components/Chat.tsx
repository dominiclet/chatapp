import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, SocketInstance } from "../types/socket";
import {BsThreeDotsVertical} from 'react-icons/bs';
import TextBubble from "./TextBubble";

interface Props {
    username: string;
}

const Chat = (props: Props) => {
	const [socket, setSocket] = useState<SocketInstance|undefined>();
	const [chatId, setChatId] = useState<string|undefined>();
	const [input, setInput] = useState<string>(""); 
    const [msgs, setMsgs] = useState<Message[]>([]);
    const d = new Date();

	useEffect(() => {
		const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string);
		setSocket(socket);
		const messages = document.getElementById("messages");

		socket.on("connect", () => {
            if (localStorage.getItem("username") == null) {
                console.log("Username not set yet! Redirecting...");
                return;
            }

            // Send a pair request
            socket.emit("pair", localStorage.getItem("username"));

			const msg = document.createElement("span");
            msg.style.color = "grey";
            msg.style.fontSize = "15px";
            msg.style.textAlign = "center";
			msg.textContent = `Finding you a chat buddy...`;
			messages?.appendChild(msg);

			socket.on("pair", (matchedId) => {
				const msg = document.createElement("span");
                msg.style.color = "grey";
                msg.style.fontSize = "15px";
                msg.style.textAlign = "center";
				msg.textContent = `You are matched with ${matchedId}`;
				messages?.appendChild(msg);
				setChatId(matchedId);
			});

            socket.on("announce", (message) => {
				const msg = document.createElement("span");
                msg.style.color = "grey";
                msg.style.fontSize = "15px";
                msg.style.textAlign = "center";
                msg.textContent = message;
                messages?.appendChild(msg);
            })

			socket.on("chat", (payload) => {
                setMsgs((currMsgs) => {
                    return [...currMsgs, payload];
                });
                const elem = document.getElementById("messages");
                (elem as HTMLElement).scrollTop = (elem as HTMLElement).scrollHeight;
			});
		});

        return () => {
            socket.close();
        }
	}, []);

	const sendMsg = () => {
		if (socket && socket.connected && chatId && input != "") {
            const message: Message = {
                name: props.username,
                content: input,
            }
			socket.emit("chat", message);
			setInput("");
		}
	}

    return (
        <div className="flex flex-col items-center w-5/6 h-screen bg-background">
            <div className="flex flex-col self-center w-full h-full overflow-y-scroll" id="messages">
                <div className="flex justify-center p-3">
                    <button disabled={true} className="rounded-lg bg-date-button text-white text-sm px-7 py-0.5">
                        {d.getDate()}/{d.getMonth()+1}/{d.getFullYear()}
                    </button>                        
                </div>
                {msgs.map((msg) => {
                    return (props.username === msg.name ? <TextBubble textContent={msg.content} self={true} /> : <TextBubble textContent={msg.content} self={false} />)
                })}
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
                                className="w-full rounded-lg outline-none bg-background"
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
                                onClick={sendMsg}
                            />                         
                        </div>        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
