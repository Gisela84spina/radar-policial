import { useState, useEffect } from "react";
import Map from "./components/Map";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideBar";

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

  const addOperativo = async () => {
    const getRandomNearbyCoords = (base, radius = 0.01) => {
      const offsetLat = (Math.random() - 0.5) * radius;
      const offsetLng = (Math.random() - 0.5) * radius;
      return [base[0] + offsetLat, base[1] + offsetLng];
    };

    const getAddress = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (!response.ok) throw new Error("Error en la geocodificación inversa");
        const data = await response.json();
        const addr = data.address;

        const road =
          addr.road ||
          addr.residential ||
          addr.pedestrian ||
          addr.cycleway ||
          addr.footway ||
          addr.path;

        const houseNumber = addr.house_number || "";
        const intersection = addr.crossroad || addr.neighbourhood || "";
        const city = addr.city || addr.town || addr.village || "";

        if (road && houseNumber) return `${road} ${houseNumber}, ${city}`;
        if (road && intersection) return `${road} y ${intersection}, ${city}`;
        if (road) return `${road}, ${city}`;

        return data.display_name || "Ubicación desconocida";
      } catch (error) {
        console.error(error);
        return "Ubicación desconocida";
      }
    };

    const [lat, lng] = getRandomNearbyCoords(userPosition, 0.02);

    // Verifica si ya existe uno muy cerca
    const yaExiste = operativos.some(
      (op) => Math.abs(op.lat - lat) < 0.0005 && Math.abs(op.lng - lng) < 0.0005
    );
    if (yaExiste) return;

    const direccion = await getAddress(lat, lng);

    const nuevoOperativo = {
      id: Date.now(),
      lat,
      lng,
      mensaje: "Operativo Policial Detectado (IA)",
      direccion,
    };

    setOperativos((prev) => {
      const actualizados = [...prev, nuevoOperativo];
      return actualizados.length > 5 ? actualizados.slice(1) : actualizados;
    });

    if (Notification.permission === "granted") {
      new Notification("¡Nuevo Operativo Policial Detectado!", {
        body: direccion,
      });
    }

    setTimeout(() => {
      setOperativos((prev) => prev.filter((op) => op.id !== nuevoOperativo.id));
    }, 2 * 60 * 1000);
  };

  useEffect(() => {
    const intervalo = setInterval(() => addOperativo(), 30000);
    return () => clearInterval(intervalo);
  }, [userPosition]);

  const handleCloseOperativo = (id) => {
    setOperativos((prev) => prev.filter((op) => op.id !== id));
  };

  return (
    <>
      <Navbar
        calles={operativos.map((o) => o.direccion)}
        onOpenSidebar={() => setSidebarVisible(true)}
      />
      <main className="pt-14 pb-16 min-h-screen">
        <Map
          userPosition={userPosition}
          operativos={operativos}
          addOperativo={addOperativo}
          handleCloseOperativo={handleCloseOperativo}
        />
      </main>
      {sidebarVisible && (
        <Sidebar
          calles={operativos.map((o) => o.direccion)}
          onClose={() => setSidebarVisible(false)}
        />
      )}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-center py-3 shadow-inner z-40">
        Powered by Gisela Spina
      </footer>
    </>
  );
};

export default App;
