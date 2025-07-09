export default function Navbar({ calles, onOpenSidebar }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-50 bg-gray-800 text-white shadow">
      <div className="h-full flex items-center justify-between px-4">
        <span className="text-lg font-bold truncate">Radar Policial</span>
        <button
          onClick={onOpenSidebar}
          className="ml-4 text-white hover:text-gray-300 focus:outline-none"
          aria-label="Abrir menú"
        >
          {/* Icono hamburguesa */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
