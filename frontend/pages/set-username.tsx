import Dog from '../components/Dog'
import Entry from '../components/Entry'

const SetUsername = () => {
  return (
    <div className="mx-auto md:h-screen flex flex-row pt:mt-0">
        <div className="lg:flex w-2/5 h-full">
          <Dog/>
        </div>
        <div className="w-3/5 h-full">
          <Entry/>
        </div>
    </div>
  )
}

export default SetUsername