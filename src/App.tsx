import Game from "./components/game"
import Modal from "./components/modal"
import info from "./assets/info.png"
import { useState } from "react"

function App() {
  const [showModal, setShowModal] = useState(false)

  function toggleModal(){
    setShowModal(!showModal)
  }

  return (
    <div className="App">
      <div className='sticky top-0 bg-blue-400 p-4 text-white font-bold text-center text-xl flex items-center justify-between'>
        <div>Wordle</div>
        <button onClick={toggleModal}><img src={info} alt="info-icon" className="w-6" /></button>
      </div>
      <Game />
      <Modal showModal={showModal} handleToggle={toggleModal}>
        <div className="font-bold text-xl">This game is created using React, Typescript and Tailwind.</div>
      </Modal>
    </div>
  )
}

export default App
