import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

const Entry = () => {
    const [name, setName] = useState("")
    useEffect(()=> {
        localStorage.setItem("username", name);
    }, [name]) 
    
    const router = useRouter()

    const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (localStorage.getItem("username")) {
            router.push('/')
        } 
        e.preventDefault()
    }

    return (
        <div className="mx-auto h-screen flex flex-col">
            <div className="w-full h-2/5 flex justify-center items-center">
                <h1 className="text-[50px] text-center">Welcome to App</h1>
            </div>
            <div className="p-20">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col p-10">
                        <label>Display Name</label>
                        <input type="text" id="username" placeholder="Enter your display name"
                            className="w-full bg-gray border border-transparent text-sm focus:outline-none rounded-lg block w-full p-2.5 mt-2 mb-5"
                            onChange={(e) => setName(e.target.value)}
                            />
                    </div>
                    
                    <div className="flex justify-center">
                        <input type="submit" value="Enter"
                        className="outline hover:outline-blue bg-button-blue focus:ring-4 text-white text-center w-1/5 px-5 py-3 mt-15 rounded-lg font-medium"
                        />
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default Entry
