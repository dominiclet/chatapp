import SideBar from "../components/SideBar";
import Image from 'next/image'
import DogImage from '../public/anotherdog.png'
import {useState, useEffect} from "react";
import {useRouter} from "next/router";


const NewChat = () => {

    const [username, setUsername] = useState("")
    const router = useRouter();
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!!!username) {
            router.push("/set-username");
            return;
        }
        setUsername(username)
    }, []);        

    const startNew = () => {
        router.push("/")
    }

    return (
        <div className="flex flex-row h-screen mx-auto pt:mt-0 bg-background">
            <SideBar username={username}/>
            <div className="flex flex-col items-center justify-center w-4/5">
                <section className="container mx-auto flex justify-center items-center p-10">
                    <Image className="p-4" src={DogImage} alt="Dog"/>
                </section> 
                <button 
                className="mb-10 text-black bg-send-button
                hover:bg-blue-500 focus:ring-4 focus:ring-transparent 
                font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                onClick={startNew}
                >Start New Chat</button>
            </div>
        </div>
    )
}

export default NewChat
