import { useState } from "react";
import Sidebar from "./SideBar";

export default function Navbar({ calles }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 flex justify-between items-center">
        <div className="text-white font-bold text-xl">Radar Policial</div>

        {/* Botón hamburguesa */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú operativos" : "Abrir menú operativos"}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Menú desktop */}
        <div className="hidden md:flex space-x-6 text-white max-w-lg overflow-x-auto">
          {calles.length === 0 ? (
            <span>No hay operativos</span>
          ) : (
            calles.map((direccion, i) => (
              <span key={i} title={direccion} className="truncate max-w-xs">
                {direccion}
              </span>
            ))
          )}
        </div>
      </nav>

      {/* Sidebar móvil */}
      {menuOpen && (
        <Sidebar calles={calles} onClose={() => setMenuOpen(false)} />
      )}
    </>
  );
}
