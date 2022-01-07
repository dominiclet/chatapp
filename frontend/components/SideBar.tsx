import {BsThreeDotsVertical} from 'react-icons/bs'

const leaveChat = () => {
    const parent: any = document.getElementById("messages")
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
}

const SideBar = (props: any) => {
    return (
        <div className="flex flex-col items-center h-full w-1/6">
            <div className="flex flex-row bg-light-blue h-min w-full mb-3 rounded-lg">
                <p className="m-4 w-full">User: {props.username}</p>
                <button>
                    <BsThreeDotsVertical className="flex justify-end m-3" size={20}/>
                </button>
            </div>                
            <div className="flex justify-center items-end bg-light-blue h-full w-full rounded-lg">
                <div className="">
                    <button 
                        className="mb-10 text-black bg-light-red 
                        hover:bg-red-400 focus:ring-4 focus:ring-transparent 
                        font-medium rounded-lg text-base px-5 py-3 w-full sm:w-auto text-center"
                        onClick={leaveChat}
                    >Leave Chat</button>
                </div>
            </div>
        </div>
        
    )
}

export default SideBar
