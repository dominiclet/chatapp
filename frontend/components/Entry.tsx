import React, {useState, useEffect, FormEventHandler} from 'react'
import {useRouter} from 'next/router'

const Entry = () => {
    const [name, setName] = useState("")
    useEffect(()=> {
        localStorage.setItem("username", name);
    }, [name]) 
    
    const router = useRouter()

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        if (localStorage.getItem("username")) {
            router.push('/')
        } 
        e.preventDefault()
    }

    return (
        <div className="flex flex-col h-screen mx-auto">
            <div className="flex items-center justify-center w-full h-2/5">
                <h1 className="text-[50px] text-center">Welcome to App</h1>
            </div>
            <div className="p-20">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col p-10">
                        <label>Display Name</label>
                        <input type="text" id="username" placeholder="Enter your display name"
                            className="w-full bg-gray border border-transparent text-sm focus:outline-none rounded-lg 
                            block w-full p-2.5 mt-2 mb-5"
                            onChange={(e) => setName(e.target.value)}
                            />
                    </div>
                    
                    <div className="flex justify-center">
                        <input type="submit" value="Enter"
                        className="w-1/5 px-5 py-3 font-medium text-center text-white rounded-lg outline hover:outline-blue bg-button-blue focus:ring-4 mt-15"
                        />
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default Entry
