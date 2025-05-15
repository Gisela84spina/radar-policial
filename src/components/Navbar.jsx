import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo o nombre */}
        <div className="text-white text-xl font-bold">Radar Policial</div>

        {/* Menú en escritorio */}
        <div className="hidden md:flex space-x-6">
          <a href="#about" className="text-white hover:text-blue-500">Acerca de</a>
          <a href="#user" className="text-white hover:text-blue-500">Usuario</a>
          <a href="#log" className="text-white hover:text-blue-500">Log</a>
        </div>

        {/* Menú hamburguesa */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white"
            onClick={() => setOpen(!open)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú desplegable en móvil */}
      {open && (
        <div className="md:hidden bg-gray-700 p-4">
          <a href="#about" className="block text-white py-2 hover:text-blue-500">Acerca de</a>
          <a href="#user" className="block text-white py-2 hover:text-blue-500">Usuario</a>
          <a href="#log" className="block text-white py-2 hover:text-blue-500">Log</a>
        </div>
      )}
    </nav>
  )
}
