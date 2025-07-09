import { useState, useEffect } from "react";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [operativos, setOperativos] = useState([]);
  const [userPosition, setUserPosition] = useState([-34.5931, -60.9439]);

  const obtenerDireccion = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Dirección desconocida";
    } catch (error) {
      console.error("Error al obtener dirección:", error);
      return "Dirección desconocida";
    }
  };
  
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

  useEffect(() => {
    const interval = setInterval( async () => {
      if (!userPosition) return;
  
      const lat = userPosition[0] + (Math.random() - 0.5) * 0.01;
      const lng = userPosition[1] + (Math.random() - 0.5) * 0.01;
  
      const direccion = await obtenerDireccion(lat, lng);
  
      const nuevoOperativo = {
        id: Date.now(),
        lat,
        lng,
        direccion,
        mensaje: "Operativo detectado por IA",
      };
     
  
      setOperativos((prev) => [...prev, nuevoOperativo]);
  
      if (Notification.permission === "granted") {
        new Notification("Nuevo operativo detectado", {
          body: direccion,
        });
      }
    }, 30000);
   
    const eliminarOperativoInterval = setInterval(() => {
      setOperativos((prev) => {
        if (prev.length === 0) return prev;
        const nuevoArray = [...prev];
        nuevoArray.shift(); // Elimina el primer elemento (más viejo)
        return nuevoArray;
      });
    }, 35000); // Eliminar cada 35 segundos
  

    return () => {
      clearInterval(interval);
      clearInterval(eliminarOperativoInterval);
    };
  }, [userPosition]);
  

  // Agregar operativo en ubicación actual
  const addOperativo = async () => {
    if (!userPosition) return;
 
    const [lat, lng] = userPosition;
    const direccion = await obtenerDireccion(lat, lng)

    const nuevoOperativo = {
      id: Date.now(),
      lat,
      lng,
      direccion,
      mensaje: "Operativo generado desde tu ubicación",
    };

    setOperativos((prev) => [...prev, nuevoOperativo]);

    if (Notification.permission === "granted") {
      new Notification("Operativo agregado", {
        body: direccion,
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
