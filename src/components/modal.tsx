interface modalProps {
  showModal: boolean,
  children: React.ReactNode,
  handleToggle: () => void
}

export default function Modal({showModal, children, handleToggle}:modalProps) {

  return (
    <div className={`${showModal ? null : "hidden"}`}>
      <div className="z-10 fixed top-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center" onClick={handleToggle}>
        <div className="z-15 relative mx-4 max-w-2xl w-full h-4/5 bg-white p-6 rounded-lg overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}