export default function Sidebar({ operativos, onClose, onRemoveOperativo }) {
  return (
    <aside className="fixed top-0 left-0 w-72 h-full bg-gray-900 text-white shadow-lg z-[1100] p-4 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Operativos Activos</h2>
        <button
          onClick={onClose}
          aria-label="Cerrar menú operativos"
          className="text-white hover:text-gray-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {operativos.length === 0 ? (
        <p>No hay operativos activos.</p>
      ) : (
        operativos.map(({ id, direccion }) => (
          <div key={id} className="mb-3 p-2 bg-gray-800 rounded shadow flex justify-between items-center">
            <span className="truncate max-w-full">{direccion}</span>
            <button
              onClick={() => onRemoveOperativo(id)}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
              aria-label="Eliminar operativo"
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </aside>
  );
}
