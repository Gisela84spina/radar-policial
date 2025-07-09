import { useState, useEffect } from "react";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [operativos, setOperativos] = useState([]);
  const [userPosition, setUserPosition] = useState([-34.5931, -60.9439]);

  // Carga inicial
  useEffect(() => {
    const stored = localStorage.getItem("operativos");
    if (stored) setOperativos(JSON.parse(stored));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn("Permiso de ubicación denegado o no disponible.")
      );
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Guardar operativos en localStorage
  useEffect(() => {
    localStorage.setItem("operativos", JSON.stringify(operativos));
  }, [operativos]);

  // Agregar operativo en ubicación actual
  const addOperativo = () => {
    if (!userPosition) return;

    const nuevoOperativo = {
      id: Date.now(),
      lat: userPosition[0],
      lng: userPosition[1],
      direccion: "Ubicación actual",
      mensaje: "Operativo generado desde tu ubicación",
    };

    setOperativos((prev) => [...prev, nuevoOperativo]);

    if (Notification.permission === "granted") {
      new Notification("Operativo agregado", {
        body: "Se detectó un nuevo operativo en tu ubicación.",
      });
    }
  };

  // Quitar operativo por id
  const handleCloseOperativo = (id) => {
    setOperativos((prev) => prev.filter((op) => op.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      {/* El sidebar está dentro del contenido principal, debajo del navbar */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Navbar
          calles={operativos.map((o) => o.direccion)}
          onOpenSidebar={() => setSidebarVisible(true)}
          sidebarVisible={sidebarVisible}
        />

        {/* Sidebar fijo debajo del navbar, aparece solo si está visible */}
        {sidebarVisible && (
          <Sidebar
            operativos={operativos}
            onClose={() => setSidebarVisible(false)}
            onRemoveOperativo={handleCloseOperativo}
          />
        )}

        <main className="pt-14 pb-16 flex-grow">
          <Map
            userPosition={userPosition}
            operativos={operativos}
            addOperativoEnUbicacionActual={addOperativo}
            handleCloseOperativo={handleCloseOperativo}
          />
        </main>

        <footer className="bg-gray-800 text-white text-center py-3 shadow-inner">
          Powered by Gisela Spina
        </footer>
      </div>
    </div>
  );
};

export default App;
