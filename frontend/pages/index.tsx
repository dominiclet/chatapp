import React from 'react'

export default function Home() {
    const username = localStorage.getItem("username")
    return (
        <div className="mx-auto md:h-screen flex flex-row pt:mt-0">
            <div className="flex flex-col justify-end items-center w-1/5 h-full bg-light-blue">
                <div>
                    <div>
                        <button className="mb-10 text-black bg-light-red hover:bg-red-400 focus:ring-4 focus:ring-transparent font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center">Leave Chat</button>
                    </div>
                </div>                
            </div>

            <div className="w-3/5 h-full">
            </div>
        </div>
    )
}



