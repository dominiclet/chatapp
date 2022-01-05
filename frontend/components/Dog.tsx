import Image from 'next/image'
import DogImage from '../public/doggo.png'

const Dog = () => {
    return (
        <div className='bg-light-blue w-full h-screen flex items-center justify-center'>
            <section className="container mx-auto flex justify-center items-center">
                <Image className="p-4" src={DogImage} alt="Dog"/>
            </section> 
        </div>
    )
}

export default Dog
