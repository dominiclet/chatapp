interface Props {
    self: boolean,
    textContent: String,
    time: String,
}

const TextBubble = (props:Props) => {
    // Props: textContent; self (true for self, false for other person); time

    return (
        <div className="px-7 m-2">
            {props.self ? (
                <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-1 items-end">
                            <span className="px-4 py-2 rounded-lg inline-block bg-orange text-white ">
                                {props.textContent}
                                <p className="flex justify-end text-[10px]">{props.time}</p>
                            </span>
                    </div>
                </div>                
            ) : (
                <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 items-start">
                        <div>
                            <span className="px-4 py-2 rounded-lg inline-block bg-light-blue text-gray-600">
                                {props.textContent}
                                <p className="flex justify-end text-[10px]">{props.time}</p>
                            </span>
                        </div>
                    </div>
                </div>              
            )}
        </div>
    )
}

export default TextBubble
