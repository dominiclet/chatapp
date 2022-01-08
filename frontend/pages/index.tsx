import React, { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import Chat from '../components/Chat'
import { useRouter } from 'next/router'

export default function Home() {
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

    return (
        <div className="flex flex-row h-screen mx-auto pt:mt-0">
            <SideBar username={username}/>
            <Chat username={username} />
        </div>
    )
}



