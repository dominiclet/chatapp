import React from 'react'

const TextBubble = (props:any) => {
    // Props: true for self, false for other person
    return (
        <div>
            {props.self ? (
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                        <div><span className="px-4 py-2 rounded-lg inline-block bg-orange text-white ">yes, I have a mac. I never had issues with root permission as well, but this helped me to solve the problem</span></div>
                    </div>
                </div>                
            ) : (
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                        <div><span className="px-4 py-2 rounded-lg inline-block bg-light-blue text-gray-600">I get the same error on Arch Linux (also with sudo)</span></div>
                        <div><span className="px-4 py-2 rounded-lg inline-block bg-light-blue text-gray-600">I also have this issue, Here is what I was doing until now: #1076</span></div>
                        <div><span className="px-4 py-2 rounded-lg inline-block bg-light-blue text-gray-600">even i am facing</span></div>
                    </div>
                </div>              
            )}
        </div>
    )
}

export default TextBubble
