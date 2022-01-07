import React, { useState, useEffect } from 'react'
import SideBar from '../components/SideBar'
import Chat from '../components/Chat'

export default function Home() {

    const [username, setUsername] = useState("")
    useEffect(() => {
        const username = localStorage.getItem("username");
        setUsername(username)
    }, []);

    return (
        <div className="mx-auto h-screen flex flex-row pt:mt-0">
            <SideBar username={username}/>
            <Chat/>
        </div>
    )
}



